// src/index.ts
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

// src/config/env-config.ts
import { cleanEnv, str } from "envalid";
function loadYantraEnvConfig(env = process.env) {
  return cleanEnv(env, {
    YANTRA_BASE_URL: str({ default: "https://cdecli-agent.cdebase.dev" }),
    YANTRA_API_KEY: str({ default: "" })
  });
}

// src/openclaw-cdecli-stream.ts
import { createAssistantMessageEventStream } from "@earendil-works/pi-ai";

// src/http-client.ts
function buildHeaders(token) {
  const h = { "content-type": "application/json" };
  if (token) h.authorization = `Bearer ${token}`;
  return h;
}
var YantraHttpClient = class {
  baseUrl;
  authToken;
  fetchImpl;
  timeoutMs;
  constructor(options) {
    if (!options.baseUrl) throw new Error("YantraHttpClient: baseUrl is required");
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.authToken = options.authToken;
    this.fetchImpl = options.fetch ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 12e4;
  }
  async health() {
    try {
      const res = await this.fetchImpl(`${this.baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
  /** Create a new server-side session. */
  async createSession(input = {}, signal) {
    const body = {
      model: input.model,
      skill: input.skill,
      skill_id: input.skillId,
      system_prompt: input.systemPrompt
    };
    const res = await this.fetchImpl(`${this.baseUrl}/v1/agent/session`, {
      method: "POST",
      headers: buildHeaders(this.authToken),
      body: JSON.stringify(body),
      signal
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`yantra createSession HTTP ${res.status}: ${text.slice(0, 500)}`);
    }
    return await res.json();
  }
  /** Non-streaming chat call. Returns the full assembled response text. */
  async chat(req, signal) {
    const ctrl = new AbortController();
    const linked = linkSignals(signal, ctrl.signal);
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await this.fetchImpl(`${this.baseUrl}/v1/agent/chat`, {
        method: "POST",
        headers: buildHeaders(this.authToken),
        body: JSON.stringify({ ...req, stream: false }),
        signal: linked
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`yantra chat HTTP ${res.status}: ${text.slice(0, 500)}`);
      }
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }
  /**
   * Streaming chat call. Yields parsed SSE events from the cdecli agent.
   * The stream ends after the `done` event or when the underlying response closes.
   */
  async *chatStream(req, signal) {
    const res = await this.fetchImpl(`${this.baseUrl}/v1/agent/chat`, {
      method: "POST",
      headers: { ...buildHeaders(this.authToken), accept: "text/event-stream" },
      body: JSON.stringify({ ...req, stream: true }),
      signal
    });
    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      throw new Error(`yantra chatStream HTTP ${res.status}: ${text.slice(0, 500)}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let sepIdx;
        while ((sepIdx = buffer.indexOf("\n\n")) !== -1) {
          const frame = buffer.slice(0, sepIdx);
          buffer = buffer.slice(sepIdx + 2);
          const parsed = parseSseFrame(frame);
          if (parsed) {
            yield parsed;
            if (parsed.event === "done") return;
          }
        }
      }
    } finally {
      try {
        reader.releaseLock();
      } catch {
      }
    }
  }
};
function parseSseFrame(frame) {
  let event = "message";
  const dataLines = [];
  for (const rawLine of frame.split("\n")) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith(":")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const field = line.slice(0, colon);
    let value = line.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "event") event = value;
    else if (field === "data") dataLines.push(value);
  }
  if (dataLines.length === 0) return null;
  const dataStr = dataLines.join("\n");
  try {
    const data = JSON.parse(dataStr);
    return { event, data };
  } catch {
    return null;
  }
}
function linkSignals(a, b) {
  if (!a) return b;
  if (a.aborted) return a;
  const ctrl = new AbortController();
  const onA = () => ctrl.abort(a.reason);
  const onB = () => ctrl.abort(b.reason);
  a.addEventListener("abort", onA, { once: true });
  b.addEventListener("abort", onB, { once: true });
  return ctrl.signal;
}

// src/openclaw-cdecli-stream.ts
var CDELI_AGENT_API = "yantra-cdecli-agent";
var sessionByOpenClaw = /* @__PURE__ */ new Map();
var EMPTY_USAGE = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
};
function resolveAgentBaseUrl() {
  return loadYantraEnvConfig().YANTRA_BASE_URL.replace(/\/+$/, "");
}
function resolveAuthToken(options) {
  const env = loadYantraEnvConfig();
  const fromOptions = options?.apiKey?.trim();
  return fromOptions || env.YANTRA_API_KEY || void 0;
}
function textFromUserContent(content) {
  if (typeof content === "string") return content;
  return content.filter((part) => part.type === "text").map((part) => part.text ?? "").join("");
}
function extractLatestUserMessage(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg?.role === "user") {
      const text = textFromUserContent(msg.content).trim();
      if (text) return text;
    }
  }
  throw new Error("yantrarouter: no user message in context");
}
function sessionKey(options) {
  return options?.sessionId?.trim() || "default";
}
function createCdecliAgentStreamFn() {
  return (model, context, options) => {
    const stream = createAssistantMessageEventStream();
    const output = {
      role: "assistant",
      content: [],
      api: model.api,
      provider: model.provider,
      model: model.id,
      usage: { ...EMPTY_USAGE },
      stopReason: "stop",
      timestamp: Date.now()
    };
    void (async () => {
      try {
        const client = new YantraHttpClient({
          baseUrl: resolveAgentBaseUrl(),
          authToken: resolveAuthToken(options)
        });
        const key = sessionKey(options);
        let cdecliSession = sessionByOpenClaw.get(key);
        if (!cdecliSession) {
          const info = await client.createSession(
            { systemPrompt: context.systemPrompt },
            options?.signal
          );
          cdecliSession = info.session_id;
          sessionByOpenClaw.set(key, cdecliSession);
        }
        const message = extractLatestUserMessage(context.messages);
        stream.push({ type: "start", partial: output });
        const textBlock = { type: "text", text: "" };
        output.content.push(textBlock);
        stream.push({ type: "text_start", contentIndex: 0, partial: output });
        for await (const ev of client.chatStream(
          { session_id: cdecliSession, message, stream: true },
          options?.signal
        )) {
          if (ev.event === "delta" || ev.event === "output") {
            const delta = ev.data.text;
            if (delta) {
              textBlock.text += delta;
              stream.push({
                type: "text_delta",
                contentIndex: 0,
                delta,
                partial: output
              });
            }
          } else if (ev.event === "error") {
            output.stopReason = "error";
            output.errorMessage = ev.data.error || "yantra stream error";
            stream.push({ type: "error", reason: "error", error: { ...output } });
            return;
          }
        }
        stream.push({
          type: "text_end",
          contentIndex: 0,
          content: textBlock.text,
          partial: output
        });
        stream.push({ type: "done", reason: "stop", message: { ...output } });
      } catch (err) {
        output.stopReason = "error";
        output.errorMessage = err instanceof Error ? err.message : String(err);
        stream.push({ type: "error", reason: "error", error: { ...output } });
      }
    })();
    return stream;
  };
}

// src/provider.ts
import { NoSuchModelError } from "@ai-sdk/provider";

// src/language-model.ts
var EMPTY_USAGE2 = {
  inputTokens: { total: void 0, noCache: void 0, cacheRead: void 0, cacheWrite: void 0 },
  outputTokens: { total: void 0, text: void 0, reasoning: void 0 }
};
var STOP = { unified: "stop", raw: void 0 };
var ERRORED = { unified: "error", raw: void 0 };
function extractLatestUserMessage2(prompt) {
  const warnings = [];
  const systemParts = [];
  let lastUserText;
  for (const msg of prompt) {
    if (msg.role === "system") {
      systemParts.push(msg.content);
      continue;
    }
    if (msg.role === "user") {
      const text = msg.content.map((part) => {
        if (part.type === "text") return part.text;
        warnings.push(`yantra provider: ignoring unsupported user part type "${part.type}"`);
        return "";
      }).join("");
      if (text) lastUserText = text;
      continue;
    }
  }
  if (lastUserText === void 0) {
    throw new Error("yantra provider: prompt contains no user text content");
  }
  return {
    message: lastUserText,
    systemPrompt: systemParts.length > 0 ? systemParts.join("\n\n") : void 0,
    warnings
  };
}
function unsupported(feature) {
  return { type: "unsupported", feature };
}
var YantraLanguageModel = class {
  specificationVersion = "v3";
  provider = "yantra";
  modelId;
  supportedUrls = {};
  client;
  opts;
  sessionId;
  sessionInit;
  constructor(opts) {
    this.modelId = opts.modelId;
    this.client = opts.client;
    this.opts = opts;
    this.sessionId = opts.sessionId;
  }
  async ensureSession(systemPrompt) {
    if (this.sessionId) return this.sessionId;
    if (!this.sessionInit) {
      this.sessionInit = (async () => {
        const info = await this.client.createSession({
          model: this.modelId && this.modelId !== "default" ? this.modelId : void 0,
          skill: this.opts.skill,
          skillId: this.opts.skillId,
          systemPrompt
        });
        this.sessionId = info.session_id;
        return this.sessionId;
      })();
    }
    return this.sessionInit;
  }
  collectWarnings(options) {
    const warnings = [];
    if (options.temperature !== void 0) warnings.push(unsupported("temperature"));
    if (options.topP !== void 0) warnings.push(unsupported("topP"));
    if (options.topK !== void 0) warnings.push(unsupported("topK"));
    if (options.frequencyPenalty !== void 0) warnings.push(unsupported("frequencyPenalty"));
    if (options.presencePenalty !== void 0) warnings.push(unsupported("presencePenalty"));
    if (options.stopSequences && options.stopSequences.length > 0) warnings.push(unsupported("stopSequences"));
    if (options.seed !== void 0) warnings.push(unsupported("seed"));
    if (options.maxOutputTokens !== void 0) warnings.push(unsupported("maxOutputTokens"));
    if (options.tools && options.tools.length > 0) {
      warnings.push({
        type: "other",
        message: "yantra executes tools server-side; client-supplied tool definitions are ignored."
      });
    }
    return warnings;
  }
  async doGenerate(options) {
    const warnings = this.collectWarnings(options);
    const { message, systemPrompt, warnings: convWarnings } = extractLatestUserMessage2(options.prompt);
    for (const w of convWarnings) warnings.push({ type: "other", message: w });
    const sessionId = await this.ensureSession(systemPrompt);
    const requestBody = {
      session_id: sessionId,
      message,
      ...this.modelId && this.modelId !== "default" ? { model: this.modelId } : {},
      skill: this.opts.skill,
      skill_id: this.opts.skillId,
      local: this.opts.local,
      stream: false
    };
    const resp = await this.client.chat(requestBody, options.abortSignal);
    const providerMetadata = {
      yantra: { sessionId: resp.session_id }
    };
    return {
      content: [{ type: "text", text: resp.response }],
      finishReason: STOP,
      usage: EMPTY_USAGE2,
      warnings,
      request: { body: requestBody },
      response: { id: resp.session_id, modelId: this.modelId },
      providerMetadata
    };
  }
  async doStream(options) {
    const warnings = this.collectWarnings(options);
    const { message, systemPrompt, warnings: convWarnings } = extractLatestUserMessage2(options.prompt);
    for (const w of convWarnings) warnings.push({ type: "other", message: w });
    const sessionId = await this.ensureSession(systemPrompt);
    const requestBody = {
      session_id: sessionId,
      message,
      ...this.modelId && this.modelId !== "default" ? { model: this.modelId } : {},
      skill: this.opts.skill,
      skill_id: this.opts.skillId,
      local: this.opts.local,
      stream: true
    };
    const client = this.client;
    const modelId = this.modelId;
    const textBlockId = "txt-0";
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue({ type: "stream-start", warnings });
        controller.enqueue({ type: "response-metadata", id: sessionId, modelId });
        controller.enqueue({ type: "text-start", id: textBlockId });
        let finishReason = STOP;
        try {
          for await (const ev of client.chatStream(requestBody, options.abortSignal)) {
            switch (ev.event) {
              case "delta":
              case "output":
                if (ev.data.text) {
                  controller.enqueue({ type: "text-delta", id: textBlockId, delta: ev.data.text });
                }
                break;
              case "error":
                finishReason = ERRORED;
                controller.enqueue({
                  type: "error",
                  error: new Error(ev.data.error || "yantra stream error")
                });
                break;
              case "done":
              case "session":
              case "status":
              case "tool_call":
              case "tool_result":
                break;
            }
          }
        } catch (err) {
          finishReason = ERRORED;
          controller.enqueue({ type: "error", error: err });
        } finally {
          controller.enqueue({ type: "text-end", id: textBlockId });
          controller.enqueue({ type: "finish", finishReason, usage: EMPTY_USAGE2 });
          controller.close();
        }
      }
    });
    return { stream, request: { body: requestBody } };
  }
};

// src/provider.ts
function resolveBaseUrl(explicit) {
  const env = loadYantraEnvConfig();
  const url = explicit || env.YANTRA_BASE_URL;
  if (!url) {
    throw new Error(
      "yantra provider: no baseUrl supplied. Pass `createYantra({ baseUrl })` or set YANTRA_BASE_URL to the cdecli agent URL."
    );
  }
  return url.replace(/\/+$/, "");
}
function resolveAuthToken2(explicit) {
  if (explicit) return explicit;
  const env = loadYantraEnvConfig();
  return env.YANTRA_API_KEY || void 0;
}
function createYantra(options = {}) {
  const client = new YantraHttpClient({
    baseUrl: resolveBaseUrl(options.baseUrl),
    authToken: resolveAuthToken2(options.authToken),
    fetch: options.fetch,
    timeoutMs: options.timeoutMs
  });
  const createModel = (modelId, settings) => {
    return new YantraLanguageModel({
      modelId,
      client,
      ...options.defaultSettings,
      ...settings
    });
  };
  const provider = Object.assign(
    (modelId, settings) => createModel(modelId, settings),
    {
      languageModel: createModel,
      chat: createModel,
      provider: "yantra",
      specificationVersion: "v3",
      embeddingModel(modelId) {
        throw new NoSuchModelError({ modelId, modelType: "embeddingModel" });
      },
      imageModel(modelId) {
        throw new NoSuchModelError({ modelId, modelType: "imageModel" });
      },
      getClient() {
        return client;
      }
    }
  );
  return provider;
}
var yantra = new Proxy(
  function yantraProxyTarget() {
  },
  {
    get(_t, prop, receiver) {
      const real = createYantra();
      return Reflect.get(real, prop, receiver);
    },
    apply(_t, _thisArg, args) {
      return createYantra()(...args);
    }
  }
);

// src/index.ts
function cdecliAgentBaseUrl() {
  return loadYantraEnvConfig().YANTRA_BASE_URL.replace(/\/+$/, "");
}
var CDELI_MODEL = {
  id: "yantra",
  name: "cdecli agent",
  provider: "yantrarouter",
  api: CDELI_AGENT_API,
  baseUrl: cdecliAgentBaseUrl(),
  reasoning: false,
  input: ["text"],
  contextWindow: 128e3,
  maxTokens: 8192,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
};
var index_default = definePluginEntry({
  id: "yantrarouter",
  name: "YantraRouter",
  description: "Connect OpenClaw to the cdecli agent",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(api) {
    api.registerProvider({
      id: "yantrarouter",
      label: "Yantra (cdecli agent)",
      envVars: ["YANTRA_API_KEY"],
      auth: [
        {
          id: "api-key",
          methodId: "api-key",
          label: "Yantra API key",
          hint: "Bearer token from your Yantra / cdebase dashboard",
          optionKey: "yantraApiKey",
          flagName: "--yantra-api-key",
          envVar: "YANTRA_API_KEY",
          promptMessage: "Enter your Yantra API key",
          defaultModel: "yantrarouter/yantra"
        }
      ],
      resolveDynamicModel: () => ({ ...CDELI_MODEL, baseUrl: cdecliAgentBaseUrl() }),
      createStreamFn: () => createCdecliAgentStreamFn()
    });
  }
});
export {
  CDELI_AGENT_API,
  YantraHttpClient,
  YantraLanguageModel,
  createCdecliAgentStreamFn,
  createYantra,
  index_default as default,
  parseSseFrame,
  yantra
};
