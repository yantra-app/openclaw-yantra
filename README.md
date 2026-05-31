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

## Source

[github.com/yantra-app/openclaw-yantra](https://github.com/yantra-app/openclaw-yantra)
