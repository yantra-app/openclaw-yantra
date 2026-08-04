# @yantra/openclaw-yantrarouter

OpenClaw plugin that connects your agent to the **cdecli agent** (`https://cdecli-agent.cdebase.dev`). No model picker — cdecli handles routing on the server.

## Install

```bash
openclaw plugins install clawhub:@yantra/openclaw-yantrarouter
```

## Setup (API key only)

```bash
openclaw config set env.YANTRA_API_KEY "your-api-key"
openclaw config set agents.defaults.model.primary "yantrarouter/yantra"
openclaw gateway restart
```

Optional: override the agent URL (default is cdecli production):

```bash
export YANTRA_BASE_URL="https://cdecli-agent.cdebase.dev"
```

Do **not** add a separate `models.providers.yantra` block — use the plugin model `yantrarouter/yantra` only.

## Smoke test (direct cdecli / AI SDK)

```bash
YANTRA_API_KEY=your-key node examples/smoke.mjs
```

## Environment

| Variable | Description |
|---|---|
| `YANTRA_API_KEY` | Bearer token from your Yantra / cdebase dashboard |
| `YANTRA_BASE_URL` | cdecli agent host (default: `https://cdecli-agent.cdebase.dev`) |

---

## Architecture

The package is small (~900 lines of TypeScript across seven source files) and exists to bridge two
systems that don't know about each other: **OpenClaw**, which expects a streaming model provider,
and the **cdecli agent**, which speaks its own session + SSE HTTP protocol.

There is deliberately **no model picker**. The plugin exposes exactly one model id —
`yantrarouter/yantra` — and cdecli decides which underlying model actually serves the turn.

### The layers

```
        ┌── OpenClaw gateway ──┐        ┌── plain AI SDK apps ──┐
        │   (TUI / agent)      │        │  generateText/stream  │
        └──────────┬───────────┘        └───────────┬───────────┘
                   │                                │
                   ▼                                ▼
            src/index.ts                      src/provider.ts
      definePluginEntry → registerProvider     createYantra() / yantra
                   │                                │
                   ▼                                ▼
    src/openclaw-cdecli-stream.ts          src/language-model.ts
        (OpenClaw StreamFn)                  (LanguageModelV3)
                   │                                │
                   ├── src/pi-event-stream.ts       │
                   │   (dependency-free queue)      │
                   │                                │
                   └────────────┬───────────────────┘
                                ▼
                        src/http-client.ts
            POST /v1/agent/session  ·  POST /v1/agent/chat (SSE)
                                ▼
                          cdecli agent
```

### Two entry points, one transport

`src/index.ts` is both doors at once. Its **default export** is the OpenClaw plugin entry
(`definePluginEntry`), and its **named exports** are the public npm library surface. Whichever
way you come in, everything funnels down into `YantraHttpClient` — the only module that knows the
wire protocol.

**As an OpenClaw plugin**, `register()` calls `api.registerProvider({ id: "yantrarouter" })` with:

- an API-key auth descriptor (`YANTRA_API_KEY`, `--yantra-api-key`, prompt text) so the gateway
  can run its normal setup flow,
- `resolveDynamicModel()` → a single static model descriptor (`yantra`, 128k context, 8192 max
  tokens, no reasoning, text input only, all costs `0` since billing happens upstream),
- `createStreamFn()` → the OpenClaw stream adapter.

**As a library**, `createYantra()` returns a standard AI SDK provider. The exported `yantra`
singleton is a `Proxy` that constructs the real provider on first property access, so importing the
package never reads env vars or throws — that only happens when you actually use it.

### Two adapters over one client

The same cdecli protocol is exposed through two different shapes, because the two consumers want
different things:

| | `openclaw-cdecli-stream.ts` | `language-model.ts` |
|---|---|---|
| Contract | OpenClaw `StreamFn` | AI SDK `LanguageModelV3` |
| Emits | pi-ai style events (`start`, `text_start`, `text_delta`, `text_end`, `done`) | `ReadableStream<LanguageModelV3StreamPart>` |
| Session cache | module-level `Map`, keyed by OpenClaw session id | per-model-instance, memoized promise |
| Non-streaming | — | `doGenerate()` via `POST /v1/agent/chat` |

Both share one important behaviour: **only the latest user message is sent upstream.** Prior
conversation context lives server-side in the cdecli session, so the adapters walk backwards
through the message list, take the most recent user turn, and post just that. The system prompt is
passed once, at session creation.

`pi-event-stream.ts` exists purely so the OpenClaw adapter doesn't need a runtime dependency on
`@earendil-works/pi-ai`. It's a ~80-line async event queue: `push()` events, iterate it with
`for await`, and `result()` resolves when a terminal `done`/`error` event arrives.

### The HTTP client

`YantraHttpClient` is the whole wire protocol in one file:

- `GET /health` → boolean, never throws.
- `POST /v1/agent/session` → creates a server-side session, optionally seeded with a system prompt,
  model, or skill. Returns a `session_id`.
- `POST /v1/agent/chat` → the turn itself, streaming or not. Auth is `Authorization: Bearer <token>`.

Streaming uses a hand-rolled SSE reader rather than a library: read from the byte stream, decode
incrementally, split on `\n\n`, and hand each frame to `parseSseFrame` (exported and unit-tested).
Frames become typed `YantraStreamEvent`s — `session`, `status`, `output`, `delta`, `tool_call`,
`tool_result`, `done`, `error`. The generator returns as soon as `done` arrives.

Non-streaming calls get a 120s default timeout, implemented by `linkSignals`, which merges the
caller's `AbortSignal` with the internal timeout signal so either can cancel the request.

Note that `tool_call` and `tool_result` events are currently parsed but not surfaced by either
adapter — tools execute server-side inside cdecli, and only the resulting text reaches the client.
For the same reason, the language model emits AI SDK warnings for client-supplied tool definitions
and for sampling parameters (`temperature`, `topP`, `topK`, penalties, `stopSequences`, `seed`,
`maxOutputTokens`), none of which the cdecli agent accepts. Token usage always comes back empty,
since the upstream protocol doesn't report it.

### Configuration

`config/env-config.ts` is the single source of truth for env: `envalid`'s `cleanEnv` with
`YANTRA_BASE_URL` defaulting to cdecli production and `YANTRA_API_KEY` defaulting to empty. Every
other module resolves config through it, and an explicitly-passed `authToken` or `baseUrl` always
wins over the environment.

### Build & packaging

`tsup` bundles `src/index.ts` into ESM (`dist/index.js`), CJS (`dist/index.cjs`), and type
declarations. `openclaw.plugin.json` points the gateway at the CJS build, while `package.json`'s
`openclaw.extensions` field points at the ESM one.

Runtime `dependencies` is intentionally **empty** — `@ai-sdk/provider`, `envalid`, and `openclaw`
itself are dev-only and bundled at build time, so installing the plugin can't drag a conflicting
copy of OpenClaw into the gateway's tree.

## Development

```bash
yarn install
yarn build        # tsup → dist/
yarn test         # vitest
yarn typecheck    # tsc --noEmit
yarn lint         # eslint src
```

Tests cover the SSE frame parser and HTTP client (`http-client.test.ts`), the provider factory and
its lazy proxy (`provider.test.ts`), and the OpenClaw stream adapter
(`openclaw-cdecli-stream.test.ts`).

## Source

[github.com/yantra-app/openclaw-yantra](https://github.com/yantra-app/openclaw-yantra)
