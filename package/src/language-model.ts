import type {
  JSONValue,
  LanguageModelV3,
  LanguageModelV3CallOptions,
  LanguageModelV3Content,
  LanguageModelV3FinishReason,
  LanguageModelV3Prompt,
  LanguageModelV3StreamPart,
  LanguageModelV3Usage,
  SharedV3ProviderMetadata,
  SharedV3Warning,
} from "@ai-sdk/provider";
import type { YantraHttpClient } from "./http-client.js";

export interface YantraLanguageModelOptions {
  modelId: string;
  client: YantraHttpClient;
  sessionId?: string;
  skill?: string;
  skillId?: string;
  local?: boolean;
}

const EMPTY_USAGE: LanguageModelV3Usage = {
  inputTokens: { total: undefined, noCache: undefined, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: undefined, text: undefined, reasoning: undefined },
};

const STOP: LanguageModelV3FinishReason = { unified: "stop", raw: undefined };
const ERRORED: LanguageModelV3FinishReason = { unified: "error", raw: undefined };

function extractLatestUserMessage(prompt: LanguageModelV3Prompt): {
  message: string;
  systemPrompt: string | undefined;
  warnings: string[];
} {
  const warnings: string[] = [];
  const systemParts: string[] = [];
  let lastUserText: string | undefined;

  for (const msg of prompt) {
    if (msg.role === "system") {
      systemParts.push(msg.content);
      continue;
    }
    if (msg.role === "user") {
      const text = msg.content
        .map((part) => {
          if (part.type === "text") return part.text;
          warnings.push(`yantra provider: ignoring unsupported user part type "${part.type}"`);
          return "";
        })
        .join("");
      if (text) lastUserText = text;
      continue;
    }
  }

  if (lastUserText === undefined) {
    throw new Error("yantra provider: prompt contains no user text content");
  }

  return {
    message: lastUserText,
    systemPrompt: systemParts.length > 0 ? systemParts.join("\n\n") : undefined,
    warnings,
  };
}

function unsupported(feature: string): SharedV3Warning {
  return { type: "unsupported", feature };
}

export class YantraLanguageModel implements LanguageModelV3 {
  readonly specificationVersion = "v3" as const;
  readonly provider = "yantra";
  readonly modelId: string;
  readonly supportedUrls: Record<string, RegExp[]> = {};

  private readonly client: YantraHttpClient;
  private readonly opts: YantraLanguageModelOptions;
  private sessionId: string | undefined;
  private sessionInit: Promise<string> | undefined;

  constructor(opts: YantraLanguageModelOptions) {
    this.modelId = opts.modelId;
    this.client = opts.client;
    this.opts = opts;
    this.sessionId = opts.sessionId;
  }

  private async ensureSession(systemPrompt: string | undefined): Promise<string> {
    if (this.sessionId) return this.sessionId;
    if (!this.sessionInit) {
      this.sessionInit = (async () => {
        const info = await this.client.createSession({
          model: this.modelId && this.modelId !== "default" ? this.modelId : undefined,
          skill: this.opts.skill,
          skillId: this.opts.skillId,
          systemPrompt,
        });
        this.sessionId = info.session_id;
        return this.sessionId;
      })();
    }
    return this.sessionInit;
  }

  private collectWarnings(options: LanguageModelV3CallOptions): SharedV3Warning[] {
    const warnings: SharedV3Warning[] = [];
    if (options.temperature !== undefined) warnings.push(unsupported("temperature"));
    if (options.topP !== undefined) warnings.push(unsupported("topP"));
    if (options.topK !== undefined) warnings.push(unsupported("topK"));
    if (options.frequencyPenalty !== undefined) warnings.push(unsupported("frequencyPenalty"));
    if (options.presencePenalty !== undefined) warnings.push(unsupported("presencePenalty"));
    if (options.stopSequences && options.stopSequences.length > 0) warnings.push(unsupported("stopSequences"));
    if (options.seed !== undefined) warnings.push(unsupported("seed"));
    if (options.maxOutputTokens !== undefined) warnings.push(unsupported("maxOutputTokens"));
    if (options.tools && options.tools.length > 0) {
      warnings.push({
        type: "other",
        message: "yantra executes tools server-side; client-supplied tool definitions are ignored.",
      });
    }
    return warnings;
  }

  async doGenerate(options: LanguageModelV3CallOptions): Promise<{
    content: LanguageModelV3Content[];
    finishReason: LanguageModelV3FinishReason;
    usage: LanguageModelV3Usage;
    warnings: SharedV3Warning[];
    request?: { body?: unknown };
    response?: { id?: string; modelId?: string };
    providerMetadata?: SharedV3ProviderMetadata;
  }> {
    const warnings = this.collectWarnings(options);
    const { message, systemPrompt, warnings: convWarnings } = extractLatestUserMessage(options.prompt);
    for (const w of convWarnings) warnings.push({ type: "other", message: w });

    const sessionId = await this.ensureSession(systemPrompt);
    const requestBody = {
      session_id: sessionId,
      message,
      ...(this.modelId && this.modelId !== "default" ? { model: this.modelId } : {}),
      skill: this.opts.skill,
      skill_id: this.opts.skillId,
      local: this.opts.local,
      stream: false,
    };

    const resp = await this.client.chat(requestBody, options.abortSignal);

    const providerMetadata: SharedV3ProviderMetadata = {
      yantra: { sessionId: resp.session_id as JSONValue },
    };

    return {
      content: [{ type: "text", text: resp.response }],
      finishReason: STOP,
      usage: EMPTY_USAGE,
      warnings,
      request: { body: requestBody },
      response: { id: resp.session_id, modelId: this.modelId },
      providerMetadata,
    };
  }

  async doStream(options: LanguageModelV3CallOptions): Promise<{
    stream: ReadableStream<LanguageModelV3StreamPart>;
    request?: { body?: unknown };
    response?: { headers?: Record<string, string> };
  }> {
    const warnings = this.collectWarnings(options);
    const { message, systemPrompt, warnings: convWarnings } = extractLatestUserMessage(options.prompt);
    for (const w of convWarnings) warnings.push({ type: "other", message: w });

    const sessionId = await this.ensureSession(systemPrompt);
    const requestBody = {
      session_id: sessionId,
      message,
      ...(this.modelId && this.modelId !== "default" ? { model: this.modelId } : {}),
      skill: this.opts.skill,
      skill_id: this.opts.skillId,
      local: this.opts.local,
      stream: true,
    };

    const client = this.client;
    const modelId = this.modelId;
    const textBlockId = "txt-0";

    const stream = new ReadableStream<LanguageModelV3StreamPart>({
      async start(controller) {
        controller.enqueue({ type: "stream-start", warnings });
        controller.enqueue({ type: "response-metadata", id: sessionId, modelId });
        controller.enqueue({ type: "text-start", id: textBlockId });

        let finishReason: LanguageModelV3FinishReason = STOP;
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
                  error: new Error(ev.data.error || "yantra stream error"),
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
          controller.enqueue({ type: "finish", finishReason, usage: EMPTY_USAGE });
          controller.close();
        }
      },
    });

    return { stream, request: { body: requestBody } };
  }
}
