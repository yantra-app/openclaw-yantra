import type {
  OpenClawPluginApi,
  OpenClawPluginDefinition,
} from "openclaw/plugin-sdk/plugin-entry";

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

const plugin: OpenClawPluginDefinition = {
  id: "yantrarouter",

  name: "YantraRouter",

  description: "Yantra AI Model Router",

  register(api: OpenClawPluginApi) {
    // Runtime API accepts the simpler object shape even though the TS type is stricter.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api.registerProvider({
      id: "yantrarouter",
      name: "YantraRouter",
      api: "openai-completions",
      baseUrl: "https://cdecli-agent.cdebase.dev",
      envKey: "YANTRA_API_KEY",
      defaultModel: "yantra/gpt-4.1",
      models: [
        {
          id: "yantra/gpt-4.1",
          name: "GPT 4.1",
          contextWindow: 128000,
          maxTokens: 8192,
        },
        {
          id: "yantra/claude-sonnet-4",
          name: "Claude Sonnet 4",
          contextWindow: 200000,
          maxTokens: 8192,
        },
        {
          id: "yantra/deepseek-r1",
          name: "DeepSeek R1",
          contextWindow: 128000,
          maxTokens: 8192,
        },
      ],
    } as any);
  },
};

export default plugin;