import { describe, expect, it } from "vitest";
import { extractLatestUserMessage } from "./openclaw-cdecli-stream.js";

describe("extractLatestUserMessage", () => {
  it("returns the latest user text", () => {
    const text = extractLatestUserMessage([
      { role: "user", content: "first", timestamp: 1 },
      { role: "assistant", content: [{ type: "text", text: "hi" }], api: "x", provider: "y", model: "z", usage: {} as never, stopReason: "stop", timestamp: 2 },
      { role: "user", content: [{ type: "text", text: "second" }], timestamp: 3 },
    ]);
    expect(text).toBe("second");
  });
});
