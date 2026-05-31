import { LanguageModelV3, LanguageModelV3CallOptions, LanguageModelV3Content, LanguageModelV3FinishReason, LanguageModelV3Usage, SharedV3Warning, SharedV3ProviderMetadata, LanguageModelV3StreamPart } from '@ai-sdk/provider';

interface YantraHttpClientOptions {
    /** Base URL of the cdecli agent HTTP API, e.g. `https://cdecli-agent.cdebase.dev`. */
    baseUrl: string;
    /** Bearer token sent as `Authorization: Bearer <token>`. */
    authToken?: string;
    /** Custom fetch implementation. Defaults to global `fetch`. */
    fetch?: typeof fetch;
    /** Default request timeout in ms (non-streaming). */
    timeoutMs?: number;
}
interface CreateSessionInput {
    model?: string;
    skill?: string;
    skillId?: string;
    systemPrompt?: string;
}
interface SessionInfo {
    session_id: string;
    user_id?: string;
    created_at: string;
    last_active: string;
    turns?: number;
    model?: string;
    skill?: string;
    skill_id?: string;
}
interface ChatRequest {
    session_id: string;
    message: string;
    stream?: boolean;
    model?: string;
    skill?: string;
    skill_id?: string;
    local?: boolean;
}
interface ChatResponse {
    session_id: string;
    response: string;
    done: boolean;
}
/** SSE event payloads as emitted by the cdecli agent. */
type YantraStreamEvent = {
    event: "session";
    data: {
        session_id: string;
    };
} | {
    event: "status";
    data: {
        status: string;
    };
} | {
    event: "output";
    data: {
        text: string;
    };
} | {
    event: "delta";
    data: {
        text: string;
    };
} | {
    event: "tool_call";
    data: {
        name: string;
        detail: string;
    };
} | {
    event: "tool_result";
    data: {
        name: string;
        success: boolean;
        summary: string;
    };
} | {
    event: "done";
    data: Record<string, never>;
} | {
    event: "error";
    data: {
        error: string;
    };
};
declare class YantraHttpClient {
    private readonly baseUrl;
    private readonly authToken;
    private readonly fetchImpl;
    private readonly timeoutMs;
    constructor(options: YantraHttpClientOptions);
    health(): Promise<boolean>;
    /** Create a new server-side session. */
    createSession(input?: CreateSessionInput, signal?: AbortSignal): Promise<SessionInfo>;
    /** Non-streaming chat call. Returns the full assembled response text. */
    chat(req: ChatRequest, signal?: AbortSignal): Promise<ChatResponse>;
    /**
     * Streaming chat call. Yields parsed SSE events from the cdecli agent.
     * The stream ends after the `done` event or when the underlying response closes.
     */
    chatStream(req: ChatRequest, signal?: AbortSignal): AsyncGenerator<YantraStreamEvent>;
}
declare function parseSseFrame(frame: string): YantraStreamEvent | null;

interface YantraLanguageModelOptions {
    modelId: string;
    client: YantraHttpClient;
    sessionId?: string;
    skill?: string;
    skillId?: string;
    local?: boolean;
}
declare class YantraLanguageModel implements LanguageModelV3 {
    readonly specificationVersion: "v3";
    readonly provider = "yantra";
    readonly modelId: string;
    readonly supportedUrls: Record<string, RegExp[]>;
    private readonly client;
    private readonly opts;
    private sessionId;
    private sessionInit;
    constructor(opts: YantraLanguageModelOptions);
    private ensureSession;
    private collectWarnings;
    doGenerate(options: LanguageModelV3CallOptions): Promise<{
        content: LanguageModelV3Content[];
        finishReason: LanguageModelV3FinishReason;
        usage: LanguageModelV3Usage;
        warnings: SharedV3Warning[];
        request?: {
            body?: unknown;
        };
        response?: {
            id?: string;
            modelId?: string;
        };
        providerMetadata?: SharedV3ProviderMetadata;
    }>;
    doStream(options: LanguageModelV3CallOptions): Promise<{
        stream: ReadableStream<LanguageModelV3StreamPart>;
        request?: {
            body?: unknown;
        };
        response?: {
            headers?: Record<string, string>;
        };
    }>;
}

interface YantraProviderSettings {
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
type YantraModelSettings = Pick<YantraLanguageModelOptions, "sessionId" | "skill" | "skillId" | "local">;
interface YantraProvider {
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
declare function createYantra(options?: YantraProviderSettings): YantraProvider;
/**
 * Default provider — reads `YANTRA_BASE_URL` and `YANTRA_API_KEY` from the env
 * on first use.
 */
declare const yantra: YantraProvider;

/**
 * Env contract for the Yantra AI SDK provider.
 */
interface YantraEnvConfig {
    YANTRA_BASE_URL: string;
    YANTRA_API_KEY: string;
}

/** Minimal OpenClaw/pi-ai-compatible event stream (no @earendil-works/pi-ai dependency). */
declare class EventStream<T, R = T> implements AsyncIterable<T> {
    private readonly isComplete;
    private readonly extractResult;
    private queue;
    private waiting;
    private done;
    private finalResultPromise;
    private resolveFinalResult;
    constructor(isComplete: (event: T) => boolean, extractResult: (event: T) => R);
    push(event: T): void;
    end(result?: R): void;
    [Symbol.asyncIterator](): AsyncIterator<T>;
    result(): Promise<R>;
}
type AssistantMessageEvent = any;
declare class AssistantMessageEventStream extends EventStream<AssistantMessageEvent, any> {
    constructor();
}

/** Custom pi-ai API id — stream goes to cdecli /v1/agent/chat, not OpenAI completions. */
declare const CDELI_AGENT_API = "yantra-cdecli-agent";
interface OpenClawMessage {
    role: string;
    content: string | Array<{
        type: string;
        text?: string;
    }>;
}
interface OpenClawContext {
    systemPrompt?: string;
    messages: OpenClawMessage[];
}
interface OpenClawStreamOptions {
    apiKey?: string;
    sessionId?: string;
    signal?: AbortSignal;
}
/** OpenClaw StreamFn — every turn hits cdecli-agent /v1/agent/chat directly. */
declare function createCdecliAgentStreamFn(): (model: any, context: OpenClawContext, options?: OpenClawStreamOptions) => AssistantMessageEventStream;

declare const _default: any;

export { CDELI_AGENT_API, type ChatRequest, type ChatResponse, type CreateSessionInput, type SessionInfo, type YantraEnvConfig, YantraHttpClient, type YantraHttpClientOptions, YantraLanguageModel, type YantraLanguageModelOptions, type YantraModelSettings, type YantraProvider, type YantraProviderSettings, type YantraStreamEvent, createCdecliAgentStreamFn, createYantra, _default as default, parseSseFrame, yantra };
