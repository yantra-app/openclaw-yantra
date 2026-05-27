import { createYantra } from "../dist/index.js";
import { generateText, streamText } from "ai";

const yantra = createYantra({
  authToken: process.env.YANTRA_API_KEY,
  baseUrl: process.env.YANTRA_BASE_URL, // defaults to https://cdecli-agent.cdebase.dev
});

console.log("--- non-streaming ---");
const { text } = await generateText({
  model: yantra("default"),
  prompt: "Say hello in one sentence.",
});
console.log(text);

console.log("\n--- streaming ---");
const { textStream } = await streamText({
  model: yantra("default"),
  prompt: "Count from 1 to 5, one number per line.",
});
for await (const chunk of textStream) process.stdout.write(chunk);
console.log();
