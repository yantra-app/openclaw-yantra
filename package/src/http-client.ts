export interface YantraHttpClientOptions {
  /** Base URL of the cdecli agent HTTP API, e.g. `https://cdecli-agent.cdebase.dev`. */
  baseUrl: string;
  /** Bearer token sent as `Authorization: Bearer <token>`. */
  authToken?: string;
  /** Custom fetch implementation. Defaults to global `fetch`. */
  fetch?: typeof fetch;
  /** Default request timeout in ms (non-streaming). */
  timeoutMs?: number;
}

export interface CreateSessionInput {
  model?: string;
  skill?: string;
  skillId?: string;
  systemPrompt?: string;
}

export interface SessionInfo {
  session_id: string;
  user_id?: string;
  created_at: string;
  last_active: string;
  turns?: number;
  model?: string;
  skill?: string;
  skill_id?: string;
}

export interface ChatRequest {
  session_id: string;
  message: string;
  stream?: boolean;
  model?: string;
  skill?: string;
  skill_id?: string;
  local?: boolean;
}

export interface ChatResponse {
  session_id: string;
  response: string;
  done: boolean;
}

/** SSE event payloads as emitted by the cdecli agent. */
export type YantraStreamEvent =
  | { event: "session"; data: { session_id: string } }
  | { event: "status"; data: { status: string } }
  | { event: "output"; data: { text: string } }
  | { event: "delta"; data: { text: string } }
  | { event: "tool_call"; data: { name: string; detail: string } }
  | { event: "tool_result"; data: { name: string; success: boolean; summary: string } }
  | { event: "done"; data: Record<string, never> }
  | { event: "error"; data: { error: string } };

function buildHeaders(token: string | undefined): Record<string, string> {
  const h: Record<string, string> = { "content-type": "application/json" };
  if (token) h.authorization = `Bearer ${token}`;
  return h;
}

export class YantraHttpClient {
  private readonly baseUrl: string;
  private readonly authToken: string | undefined;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: YantraHttpClientOptions) {
    if (!options.baseUrl) throw new Error("YantraHttpClient: baseUrl is required");
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.authToken = options.authToken;
    this.fetchImpl = options.fetch ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 120_000;
  }

  async health(): Promise<boolean> {
    try {
      const res = await this.fetchImpl(`${this.baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  /** Create a new server-side session. */
  async createSession(input: CreateSessionInput = {}, signal?: AbortSignal): Promise<SessionInfo> {
    const body = {
      model: input.model,
      skill: input.skill,
      skill_id: input.skillId,
      system_prompt: input.systemPrompt,
    };
    const res = await this.fetchImpl(`${this.baseUrl}/v1/agent/session`, {
      method: "POST",
      headers: buildHeaders(this.authToken),
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`yantra createSession HTTP ${res.status}: ${text.slice(0, 500)}`);
    }
    return (await res.json()) as SessionInfo;
  }

  /** Non-streaming chat call. Returns the full assembled response text. */
  async chat(req: ChatRequest, signal?: AbortSignal): Promise<ChatResponse> {
    const ctrl = new AbortController();
    const linked = linkSignals(signal, ctrl.signal);
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await this.fetchImpl(`${this.baseUrl}/v1/agent/chat`, {
        method: "POST",
        headers: buildHeaders(this.authToken),
        body: JSON.stringify({ ...req, stream: false }),
        signal: linked,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`yantra chat HTTP ${res.status}: ${text.slice(0, 500)}`);
      }
      return (await res.json()) as ChatResponse;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Streaming chat call. Yields parsed SSE events from the cdecli agent.
   * The stream ends after the `done` event or when the underlying response closes.
   */
  async *chatStream(req: ChatRequest, signal?: AbortSignal): AsyncGenerator<YantraStreamEvent> {
    const res = await this.fetchImpl(`${this.baseUrl}/v1/agent/chat`, {
      method: "POST",
      headers: { ...buildHeaders(this.authToken), accept: "text/event-stream" },
      body: JSON.stringify({ ...req, stream: true }),
      signal,
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

        let sepIdx: number;
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
        // ignore
      }
    }
  }
}

export function parseSseFrame(frame: string): YantraStreamEvent | null {
  let event = "message";
  const dataLines: string[] = [];
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
    return { event, data } as YantraStreamEvent;
  } catch {
    return null;
  }
}

function linkSignals(a: AbortSignal | undefined, b: AbortSignal): AbortSignal {
  if (!a) return b;
  if (a.aborted) return a;
  const ctrl = new AbortController();
  const onA = () => ctrl.abort((a as AbortSignal).reason);
  const onB = () => ctrl.abort(b.reason);
  a.addEventListener("abort", onA, { once: true });
  b.addEventListener("abort", onB, { once: true });
  return ctrl.signal;
}
