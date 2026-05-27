import { NoSuchModelError, type LanguageModelV3 } from "@ai-sdk/provider";
import { loadYantraEnvConfig } from "./config/env-config.js";
import { YantraHttpClient, type YantraHttpClientOptions } from "./http-client.js";
import { YantraLanguageModel, type YantraLanguageModelOptions } from "./language-model.js";

export interface YantraProviderSettings {
  /**
   * Base URL of the cdecli agent HTTP API
   * (e.g. `https://cdecli-agent.cdebase.dev` or `http://localhost:8090`).
   * Defaults to `process.env.YANTRA_BASE_URL`.
   */
  baseUrl?: string;
  /**
   * Bearer token sent as `Authorization: Bearer <token>`.
   * Defaults to `process.env.YANTRA_API_KEY`.
   */
  authToken?: string;
  /** Custom fetch implementation (defaults to global `fetch`). */
  fetch?: typeof fetch;
  /** Default request timeout in ms. Default: 120000. */
  timeoutMs?: number;
  /** Per-model defaults applied when creating sessions. */
  defaultSettings?: Pick<YantraLanguageModelOptions, "sessionId" | "skill" | "skillId" | "local">;
}

export type YantraModelSettings = Pick<
  YantraLanguageModelOptions,
  "sessionId" | "skill" | "skillId" | "local"
>;

export interface YantraProvider {
  (modelId: string, settings?: YantraModelSettings): LanguageModelV3;
  languageModel(modelId: string, settings?: YantraModelSettings): LanguageModelV3;
  chat(modelId: string, settings?: YantraModelSettings): LanguageModelV3;
  readonly provider: "yantra";
  readonly specificationVersion: "v3";
  embeddingModel(modelId: string): never;
  imageModel(modelId: string): never;
  /** Underlying HTTP client. */
  getClient(): YantraHttpClient;
}

function resolveBaseUrl(explicit?: string): string {
  const env = loadYantraEnvConfig();
  const url = explicit || env.YANTRA_BASE_URL;
  if (!url) {
    throw new Error(
      "yantra provider: no baseUrl supplied. Pass `createYantra({ baseUrl })` or set " +
        "YANTRA_BASE_URL to the cdecli agent URL.",
    );
  }
  return url.replace(/\/+$/, "");
}

function resolveAuthToken(explicit?: string): string | undefined {
  if (explicit) return explicit;
  const env = loadYantraEnvConfig();
  return env.YANTRA_API_KEY || undefined;
}

/**
 * Create a Yantra provider that talks to the cdecli agent HTTP server.
 *
 * @example
 * const yantra = createYantra({
 *   baseUrl: "https://cdecli-agent.cdebase.dev",
 *   authToken: process.env.YANTRA_API_KEY,
 * });
 * const result = await generateText({
 *   model: yantra("default"),
 *   prompt: "Hello",
 * });
 */
export function createYantra(options: YantraProviderSettings = {}): YantraProvider {
  const client = new YantraHttpClient({
    baseUrl: resolveBaseUrl(options.baseUrl),
    authToken: resolveAuthToken(options.authToken),
    fetch: options.fetch,
    timeoutMs: options.timeoutMs,
  });

  const createModel = (modelId: string, settings?: YantraModelSettings): LanguageModelV3 => {
    return new YantraLanguageModel({
      modelId,
      client,
      ...options.defaultSettings,
      ...settings,
    });
  };

  const provider = Object.assign(
    (modelId: string, settings?: YantraModelSettings) => createModel(modelId, settings),
    {
      languageModel: createModel,
      chat: createModel,
      provider: "yantra" as const,
      specificationVersion: "v3" as const,
      embeddingModel(modelId: string): never {
        throw new NoSuchModelError({ modelId, modelType: "embeddingModel" });
      },
      imageModel(modelId: string): never {
        throw new NoSuchModelError({ modelId, modelType: "imageModel" });
      },
      getClient(): YantraHttpClient {
        return client;
      },
    },
  );

  return provider as YantraProvider;
}

/**
 * Default provider — reads `YANTRA_BASE_URL` and `YANTRA_API_KEY` from the env
 * on first use.
 */
export const yantra: YantraProvider = new Proxy(
  function yantraProxyTarget() {} as unknown as YantraProvider,
  {
    get(_t, prop, receiver) {
      const real = createYantra();
      return Reflect.get(real, prop, receiver);
    },
    apply(_t, _thisArg, args: [string, YantraModelSettings?]) {
      return createYantra()(...args);
    },
  },
) as YantraProvider;

export type { YantraHttpClientOptions };
