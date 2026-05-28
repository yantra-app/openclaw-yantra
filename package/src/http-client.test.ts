import { describe, expect, it, vi } from "vitest";
import { YantraHttpClient, parseSseFrame } from "./http-client.js";

function sseResponse(chunks: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { "content-type": "text/event-stream" },
  });
}

describe("parseSseFrame", () => {
  it("parses event + data lines", () => {
    const ev = parseSseFrame('event: delta\ndata: {"text":"hi"}');
    expect(ev).toEqual({ event: "delta", data: { text: "hi" } });
  });

  it("defaults event to 'message' when only data is present", () => {
    const ev = parseSseFrame('data: {"x":1}');
    expect(ev?.event).toBe("message");
    expect(ev?.data).toEqual({ x: 1 });
  });

  it("joins multi-line data fields with newlines", () => {
    const ev = parseSseFrame('event: output\ndata: {"text":\ndata: "ab"}');
    expect(ev?.data).toEqual({ text: "ab" });
  });

  it("ignores comment lines starting with ':'", () => {
    const ev = parseSseFrame(': keepalive\nevent: status\ndata: {"status":"ok"}');
    expect(ev).toEqual({ event: "status", data: { status: "ok" } });
  });

  it("returns null for empty / data-less frames", () => {
    expect(parseSseFrame("")).toBeNull();
    expect(parseSseFrame("event: ping")).toBeNull();
  });

  it("returns null when data is not valid JSON", () => {
    expect(parseSseFrame("event: x\ndata: not-json")).toBeNull();
  });
});

describe("YantraHttpClient construction", () => {
  it("throws when baseUrl is missing", () => {
    expect(() => new YantraHttpClient({ baseUrl: "" })).toThrow(/baseUrl is required/);
  });

  it("strips trailing slashes from baseUrl", async () => {
    const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
    const client = new YantraHttpClient({ baseUrl: "http://x//", fetch: fetchMock as unknown as typeof fetch });
    await client.health();
    expect((fetchMock.mock.calls[0] as unknown[])[0]).toBe("http://x/health");
  });
});

describe("YantraHttpClient.health", () => {
  it("returns true on 200", async () => {
    const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
    const client = new YantraHttpClient({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    expect(await client.health()).toBe(true);
  });

  it("returns false on non-2xx", async () => {
    const fetchMock = vi.fn(async () => new Response("nope", { status: 503 }));
    const client = new YantraHttpClient({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    expect(await client.health()).toBe(false);
  });

  it("returns false when fetch throws", async () => {
    const fetchMock = vi.fn(async () => { throw new Error("network down"); });
    const client = new YantraHttpClient({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    expect(await client.health()).toBe(false);
  });
});

describe("YantraHttpClient.createSession", () => {
  it("POSTs JSON, includes Bearer token, returns parsed body", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ session_id: "s1", created_at: "", last_active: "" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const client = new YantraHttpClient({
      baseUrl: "http://x",
      authToken: "tok",
      fetch: fetchMock as unknown as typeof fetch,
    });
    const info = await client.createSession({ model: "m", skillId: "sk1" });
    expect(info.session_id).toBe("s1");
    const call = fetchMock.mock.calls[0] as unknown[];
    expect(call[0]).toBe("http://x/v1/agent/session");
    const init = call[1] as RequestInit;
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer tok");
    expect(JSON.parse(init.body as string)).toEqual({
      model: "m",
      skill: undefined,
      skill_id: "sk1",
      system_prompt: undefined,
    });
  });

  it("throws on non-2xx with body excerpt", async () => {
    const fetchMock = vi.fn(async () => new Response("boom", { status: 500 }));
    const client = new YantraHttpClient({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    await expect(client.createSession()).rejects.toThrow(/HTTP 500.*boom/);
  });
});

describe("YantraHttpClient.chat", () => {
  it("sets stream:false and returns ChatResponse", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ session_id: "s1", response: "hi", done: true }), { status: 200 }),
    );
    const client = new YantraHttpClient({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    const res = await client.chat({ session_id: "s1", message: "q", stream: true });
    expect(res.response).toBe("hi");
    expect(JSON.parse(((fetchMock.mock.calls[0] as unknown[])[1] as RequestInit).body as string).stream).toBe(false);
  });

  it("throws on non-2xx", async () => {
    const fetchMock = vi.fn(async () => new Response("nope", { status: 400 }));
    const client = new YantraHttpClient({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    await expect(client.chat({ session_id: "s1", message: "q" })).rejects.toThrow(/HTTP 400/);
  });
});

describe("YantraHttpClient.chatStream", () => {
  it("yields parsed SSE events and stops after 'done'", async () => {
    const fetchMock = vi.fn(async () =>
      sseResponse([
        'event: delta\ndata: {"text":"he"}\n\n',
        'event: delta\ndata: {"text":"llo"}\n\n',
        "event: done\ndata: {}\n\n",
        'event: delta\ndata: {"text":"after-done"}\n\n',
      ]),
    );
    const client = new YantraHttpClient({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    const out: string[] = [];
    for await (const ev of client.chatStream({ session_id: "s1", message: "q" })) {
      if (ev.event === "delta") out.push((ev.data as { text: string }).text);
    }
    expect(out).toEqual(["he", "llo"]);
  });

  it("handles frames split across chunks", async () => {
    const fetchMock = vi.fn(async () =>
      sseResponse(['event: delta\ndata: {"te', 'xt":"split"}\n\n', "event: done\ndata: {}\n\n"]),
    );
    const client = new YantraHttpClient({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    const out: string[] = [];
    for await (const ev of client.chatStream({ session_id: "s1", message: "q" })) {
      if (ev.event === "delta") out.push((ev.data as { text: string }).text);
    }
    expect(out).toEqual(["split"]);
  });

  it("throws when response is non-ok", async () => {
    const fetchMock = vi.fn(async () => new Response("denied", { status: 401 }));
    const client = new YantraHttpClient({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    await expect(async () => {
      for await (const _ of client.chatStream({ session_id: "s1", message: "q" })) {
        void _;
      }
    }).rejects.toThrow(/HTTP 401/);
  });
});
