// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export { createYantra, yantra } from "./provider.js";
export type { YantraProvider, YantraProviderSettings, YantraModelSettings } from "./provider.js";
export { YantraLanguageModel } from "./language-model.js";
export type { YantraLanguageModelOptions } from "./language-model.js";
export { YantraHttpClient } from "./http-client.js";
export { loadYantraEnvConfig } from "./config/env-config.js";
export type { YantraEnvConfig } from "./config/env-config.js";
export type {
  YantraHttpClientOptions,
  CreateSessionInput,
  SessionInfo,
  ChatRequest,
  ChatResponse,
  YantraStreamEvent,
} from "./http-client.js";
export { parseSseFrame } from "./http-client.js";

const BASE_URL = "http://127.0.0.1:18790/v1";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (definePluginEntry as any)({
  id: "yantrarouter",
  name: "YantraRouter",
  description: "Yantra AI Model Router",

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(api: any) {
    api.registerProvider({
      id: "yantrarouter",
      label: "Yantra Router",
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
          defaultModel: "yantrarouter/yantra",
        },
      ],
      // Accept any model string — cdecli agent handles routing internally
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolveDynamicModel: (ctx: any) => ({
        id: ctx.modelId,
        name: ctx.modelId,
        provider: "yantrarouter",
        api: "openai-completions",
        baseUrl: BASE_URL,
        reasoning: false,
        input: ["text"],
        contextWindow: 128000,
        maxTokens: 8192,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      }),
      // Normalize array content → string (cdecli-agent only accepts string content)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wrapStreamFn: (ctx: any) => {
        const inner = ctx?.streamFn;
        if (!inner) return undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (params: any) => {
          if (params && Array.isArray(params.messages)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            params.messages = params.messages.map((m: any) => ({
              ...m,
              content: Array.isArray(m.content)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? m.content.map((p: any) => (typeof p === "string" ? p : (p?.text ?? ""))).join("")
                : m.content,
            }));
          }
          return inner(params);
        };
      },
    });
  },
});