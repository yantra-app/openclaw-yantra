// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { loadYantraEnvConfig } from "./config/env-config.js";
import { CDELI_AGENT_API, createCdecliAgentStreamFn } from "./openclaw-cdecli-stream.js";

export { createYantra, yantra } from "./provider.js";
export type { YantraProvider, YantraProviderSettings, YantraModelSettings } from "./provider.js";
export { YantraLanguageModel } from "./language-model.js";
export type { YantraLanguageModelOptions } from "./language-model.js";
export { YantraHttpClient } from "./http-client.js";
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
export { CDELI_AGENT_API, createCdecliAgentStreamFn } from "./openclaw-cdecli-stream.js";

function cdecliAgentBaseUrl(): string {
  return loadYantraEnvConfig().YANTRA_BASE_URL.replace(/\/+$/, "");
}

const CDELI_MODEL = {
  id: "yantra",
  name: "cdecli agent",
  provider: "yantrarouter",
  api: CDELI_AGENT_API,
  baseUrl: cdecliAgentBaseUrl(),
  reasoning: false,
  input: ["text"] as const,
  contextWindow: 128000,
  maxTokens: 8192,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (definePluginEntry as any)({
  id: "yantrarouter",
  name: "YantraRouter",
  description: "Connect OpenClaw to the cdecli agent",

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(api: any) {
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
          defaultModel: "yantrarouter/yantra",
        },
      ],
      resolveDynamicModel: () => ({ ...CDELI_MODEL, baseUrl: cdecliAgentBaseUrl() }),
      createStreamFn: () => createCdecliAgentStreamFn(),
    });
  },
});
