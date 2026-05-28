# @yantra/openclaw-yantrarouter

OpenClaw plugin for the **Yantra AI Model Router** — routes AI requests to GPT-4.1, Claude Sonnet 4, DeepSeek R1 and more through the Yantra cdecli agent.

## Install

```bash
openclaw plugins install clawhub:@yantra/openclaw-yantrarouter
```

## Setup

Set your Yantra API key in OpenClaw config:

```bash
openclaw config set env.YANTRA_API_KEY "your-api-key"
openclaw gateway restart
```

Or export it before starting the gateway:

```bash
export YANTRA_API_KEY="your-api-key"
```

## Usage

### Smoke test (AI SDK)

```bash
YANTRA_API_KEY=your-key node examples/smoke.mjs
```

### Available models

| Model ID | Name |
|---|---|
| `yantra/gpt-4.1` | GPT 4.1 |
| `yantra/claude-sonnet-4` | Claude Sonnet 4 |
| `yantra/deepseek-r1` | DeepSeek R1 |

## Environment variables

| Variable | Description |
|---|---|
| `YANTRA_API_KEY` | Bearer token from your Yantra / cdebase dashboard |
| `YANTRA_BASE_URL` | Override the agent endpoint (default: `https://cdecli-agent.cdebase.dev`) |

## Source

[github.com/yantra-app/openclaw-yantra](https://github.com/yantra-app/openclaw-yantra)
