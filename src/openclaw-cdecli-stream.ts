import { createAssistantMessageEventStream } from "@earendil-works/pi-ai";
import type { AssistantMessage, Context, Message, StreamOptions } from "@earendil-works/pi-ai";
import { loadYantraEnvConfig } from "./config/env-config.js";
import { YantraHttpClient } from "./http-client.js";

/** Custom pi-ai API id — stream goes to cdecli /v1/agent/chat, not OpenAI completions. */
export const CDELI_AGENT_API = "yantra-cdecli-agent";

const sessionByOpenClaw = new Map<string, string>();

const EMPTY_USAGE = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
};

function resolveAgentBaseUrl(): string {
  return loadYantraEnvConfig().YANTRA_BASE_URL.replace(/\/+$/, "");
}

function resolveAuthToken(options?: StreamOptions): string | undefined {
  const env = loadYantraEnvConfig();
  const fromOptions = options?.apiKey?.trim();
  return fromOptions || env.YANTRA_API_KEY || undefined;
}

function textFromUserContent(content: string | Array<{ type: string; text?: string }>): string {
  if (typeof content === "string") return content;
  return content
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

/** Latest user turn text for cdecli-agent (session holds prior context server-side). */
export function extractLatestUserMessage(messages: Message[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg?.role === "user") {
      const text = textFromUserContent(msg.content).trim();
      if (text) return text;
    }
  }
  throw new Error("yantrarouter: no user message in context");
}

function sessionKey(options?: StreamOptions): string {
  return options?.sessionId?.trim() || "default";
}

/** OpenClaw StreamFn — every turn hits cdecli-agent /v1/agent/chat directly. */
export function createCdecliAgentStreamFn() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: any,
    context: Context,
    options?: StreamOptions,
  ) => {
    const stream = createAssistantMessageEventStream();
    const output: AssistantMessage = {
      role: "assistant",
      content: [],
      api: model.api,
      provider: model.provider,
      model: model.id,
      usage: { ...EMPTY_USAGE },
      stopReason: "stop",
      timestamp: Date.now(),
    };

    void (async () => {
      try {
        const client = new YantraHttpClient({
          baseUrl: resolveAgentBaseUrl(),
          authToken: resolveAuthToken(options),
        });
        const key = sessionKey(options);
        let cdecliSession = sessionByOpenClaw.get(key);
        if (!cdecliSession) {
          const info = await client.createSession(
            { systemPrompt: context.systemPrompt },
            options?.signal,
          );
          cdecliSession = info.session_id;
          sessionByOpenClaw.set(key, cdecliSession);
        }

        const message = extractLatestUserMessage(context.messages);
        stream.push({ type: "start", partial: output });

        const textBlock = { type: "text" as const, text: "" };
        output.content.push(textBlock);
        stream.push({ type: "text_start", contentIndex: 0, partial: output });

        for await (const ev of client.chatStream(
          { session_id: cdecliSession, message, stream: true },
          options?.signal,
        )) {
          if (ev.event === "delta" || ev.event === "output") {
            const delta = ev.data.text;
            if (delta) {
              textBlock.text += delta;
              stream.push({
                type: "text_delta",
                contentIndex: 0,
                delta,
                partial: output,
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
          partial: output,
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

/** @internal test helper */
export function clearCdecliSessionCacheForTest(): void {
  sessionByOpenClaw.clear();
}
