import { NoSuchModelError } from "@ai-sdk/provider";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { YantraLanguageModel } from "./language-model.js";
import { createYantra, yantra } from "./provider.js";

const ENV_KEYS = ["YANTRA_BASE_URL", "YANTRA_API_KEY"] as const;

function withCleanEnv() {
  const saved: Record<string, string | undefined> = {};
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  return () => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  };
}

describe("createYantra – baseUrl resolution", () => {
  let restore: () => void;
  beforeEach(() => { restore = withCleanEnv(); });
  afterEach(() => restore());

  it("falls back to the bundled default when no env is set", async () => {
    const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
    const p = createYantra({ fetch: fetchMock as unknown as typeof fetch });
    await p.getClient().health();
    expect((fetchMock.mock.calls[0] as unknown[])[0]).toBe("https://cdecli-agent.cdebase.dev/health");
  });

  it("prefers the explicit option over env", async () => {
    process.env.YANTRA_BASE_URL = "http://env-url";
    const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
    const p = createYantra({ baseUrl: "http://opt-url", fetch: fetchMock as unknown as typeof fetch });
    await p.getClient().health();
    expect((fetchMock.mock.calls[0] as unknown[])[0]).toBe("http://opt-url/health");
  });

  it("falls back to YANTRA_BASE_URL env", async () => {
    process.env.YANTRA_BASE_URL = "http://base-url";
    const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
    const p = createYantra({ fetch: fetchMock as unknown as typeof fetch });
    await p.getClient().health();
    expect((fetchMock.mock.calls[0] as unknown[])[0]).toBe("http://base-url/health");
  });

  it("strips trailing slashes from the resolved baseUrl", async () => {
    const fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
    const p = createYantra({ baseUrl: "http://x///", fetch: fetchMock as unknown as typeof fetch });
    await p.getClient().health();
    expect((fetchMock.mock.calls[0] as unknown[])[0]).toBe("http://x/health");
  });
});

describe("createYantra – authToken resolution", () => {
  let restore: () => void;
  beforeEach(() => { restore = withCleanEnv(); });
  afterEach(() => restore());

  async function sendHeader(fetchMock: ReturnType<typeof vi.fn>, opts: Parameters<typeof createYantra>[0] = {}) {
    const p = createYantra({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch, ...opts });
    await p.getClient().createSession().catch(() => undefined);
    const init = ((fetchMock.mock.calls[0] as unknown[])[1]) as RequestInit;
    return (init.headers as Record<string, string>).authorization;
  }

  it("prefers explicit option", async () => {
    process.env.YANTRA_API_KEY = "env-tok";
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    expect(await sendHeader(fetchMock, { authToken: "opt-tok" })).toBe("Bearer opt-tok");
  });

  it("falls back to YANTRA_API_KEY env", async () => {
    process.env.YANTRA_API_KEY = "env-tok";
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    expect(await sendHeader(fetchMock)).toBe("Bearer env-tok");
  });

  it("omits Authorization header when no token is configured", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ session_id: "s1", created_at: "", last_active: "" }), { status: 200 }));
    const p = createYantra({ baseUrl: "http://x", fetch: fetchMock as unknown as typeof fetch });
    await p.getClient().createSession().catch(() => undefined);
    const headers = (((fetchMock.mock.calls[0] as unknown[])[1]) as RequestInit).headers as Record<string, string>;
    expect(headers.authorization).toBeUndefined();
  });
});

describe("YantraProvider surface", () => {
  it("callable and .languageModel / .chat return YantraLanguageModel instances", () => {
    const p = createYantra({ baseUrl: "http://x" });
    const a = p("default");
    const b = p.languageModel("default");
    const c = p.chat("default");
    expect(a).toBeInstanceOf(YantraLanguageModel);
    expect(b).toBeInstanceOf(YantraLanguageModel);
    expect(c).toBeInstanceOf(YantraLanguageModel);
    expect(p.provider).toBe("yantra");
    expect(p.specificationVersion).toBe("v3");
  });

  it("merges defaultSettings with per-model settings (per-model wins)", () => {
    const p = createYantra({
      baseUrl: "http://x",
      defaultSettings: { skill: "workflow", local: true },
    });
    const m = p("default", { local: false }) as YantraLanguageModel;
    const opts = (m as unknown as { opts: { skill?: string; local?: boolean } }).opts;
    expect(opts.skill).toBe("workflow");
    expect(opts.local).toBe(false);
  });

  it("embeddingModel and imageModel throw NoSuchModelError", () => {
    const p = createYantra({ baseUrl: "http://x" });
    expect(() => p.embeddingModel("e")).toThrow(NoSuchModelError);
    expect(() => p.imageModel("i")).toThrow(NoSuchModelError);
  });
});

describe("default yantra proxy export", () => {
  let restore: () => void;
  beforeEach(() => { restore = withCleanEnv(); });
  afterEach(() => restore());

  it("lazily instantiates on first property access using env", () => {
    expect(yantra.provider).toBe("yantra");
    const m = yantra("default");
    expect(m).toBeInstanceOf(YantraLanguageModel);
  });
});
