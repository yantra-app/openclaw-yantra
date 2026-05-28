import { cleanEnv, str } from "envalid";

/**
 * Env contract for the Yantra AI SDK provider.
 */
export interface YantraEnvConfig {
  YANTRA_BASE_URL: string;
  YANTRA_API_KEY: string;
}

export function loadYantraEnvConfig(env: NodeJS.ProcessEnv = process.env): YantraEnvConfig {
  return cleanEnv(env, {
    YANTRA_BASE_URL: str({ default: "https://cdecli-agent.cdebase.dev" }),
    YANTRA_API_KEY: str({ default: "" }),
  });
}
