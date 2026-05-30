# cdecli-agent `/v1/chat/completions` — Required Fixes for OpenClaw TUI Compatibility

Status: The local proxy has been removed from this repository; server-side fixes verified locally.

## Background

The OpenClaw TUI (`openclaw tui`) and plugin system send OpenAI-compatible requests to any
registered provider. The `yantrarouter` plugin routes these requests to
`https://cdecli-agent.cdebase.dev/v1/chat/completions`.

Currently a **local proxy** is required to translate OpenClaw's requests before they reach
cdecli-agent. The proxy handles 3 issues listed below. Once fixed on the server, the proxy
can be removed and the plugin will work out-of-the-box for all users.

---

## Fix 1 — Accept Array `content` in Messages

### Error
```
HTTP 400: invalid request body: json: cannot unmarshal array into Go struct field
oaiMessage.messages.content of type string
```

### Cause
OpenClaw (and the OpenAI spec) sends message `content` as either a plain string or an array
of content parts:

```json
{
  "messages": [
    {
      "role": "system",
      "content": [{ "type": "text", "text": "You are a helpful assistant." }]
    },
    {
      "role": "user",
      "content": [{ "type": "text", "text": "hi" }]
    }
  ]
}
```

The Go struct currently expects `content` to always be a `string`, which fails when it
receives an array.

### Reproduction
```bash
curl -s https://cdecli-agent.cdebase.dev/v1/chat/completions \
  -H "Authorization: Bearer $YANTRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "yantra",
    "stream": false,
    "messages": [
      {"role": "system", "content": [{"type": "text", "text": "You are helpful."}]},
      {"role": "user", "content": [{"type": "text", "text": "hi"}]}
    ]
  }'
# Returns: {"error":"invalid request body: json: cannot unmarshal array...","code":400}
```

### Fix (Go)
Change the message struct to accept `interface{}` and normalize internally:

```go
type oaiMessage struct {
    Role    string      `json:"role"`
    Content interface{} `json:"content"` // accepts string OR []ContentPart
}

type ContentPart struct {
    Type string `json:"type"`
    Text string `json:"text"`
}

func normalizeContent(c interface{}) string {
    switch v := c.(type) {
    case string:
        return v
    case []interface{}:
        var parts []string
        for _, p := range v {
            if m, ok := p.(map[string]interface{}); ok {
                if text, ok := m["text"].(string); ok {
                    parts = append(parts, text)
                }
            }
        }
        return strings.Join(parts, "")
    }
    return ""
}
```

---

## Fix 2 — Remove SSE Comment Lines from Streaming Response

### Error
```
Cannot read properties of undefined (reading 'systemPrompt')
```
(OpenClaw TUI crashes silently, assistant turn fails before producing content)

### Cause
The streaming response from `/v1/chat/completions` includes non-standard SSE comment lines:

```
: status ⏺ Thinking...
```

Lines starting with `:` are SSE comments per the spec. OpenClaw's SSE parser does not handle
them and crashes when it encounters one, corrupting the entire response.

### Reproduction
```bash
curl -s https://cdecli-agent.cdebase.dev/v1/chat/completions \
  -H "Authorization: Bearer $YANTRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"yantra","stream":true,"messages":[{"role":"user","content":"hi"}]}' \
  | grep "^:"
# Returns: : status ⏺ Thinking...
```

### Fix
Remove all lines starting with `:` from the `/v1/chat/completions` SSE stream.
These status lines are fine to keep on `/v1/agent/chat` which uses a custom parser.

Expected clean stream:
```
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"delta":{"role":"assistant"}}]}
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"delta":{"content":"Hello"}}]}
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"delta":{},"finish_reason":"stop"}]}
data: [DONE]
```

---

## Fix 3 — Ignore Unknown Fields in Request Body

### Error
Not an explicit error — but causes crashes when OpenClaw sends thinking/reasoning params
that the Go struct does not know about.

### Cause
OpenClaw sends additional fields in the request body that are not part of cdecli-agent's
struct definition:

```json
{
  "thinking": { "type": "enabled", "budget_tokens": 5000 },
  "service_tier": "default",
  "store": false,
  "stream_options": null
}
```

If the Go JSON decoder is strict, these cause parse errors or panics.

### Fix
Use `json:",omitempty"` and ensure the top-level request struct uses a catch-all for unknown
fields, or decode into a `map[string]interface{}` and only extract the fields you need
(`messages`, `model`, `stream`).

---

## Verification

Once all 3 fixes are deployed, run this to confirm everything works end-to-end:

```bash
curl -s https://cdecli-agent.cdebase.dev/v1/chat/completions \
  -H "Authorization: Bearer $YANTRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "yantra",
    "stream": true,
    "thinking": {"type": "enabled", "budget_tokens": 5000},
    "service_tier": "default",
    "messages": [
      {"role": "system", "content": [{"type": "text", "text": "You are a helpful assistant."}]},
      {"role": "user", "content": [{"type": "text", "text": "Say hello"}]}
    ]
  }'
```

Expected:
- HTTP 200
- Valid SSE stream
- No lines starting with `:`
- Assistant reply in `choices[0].delta.content`
- Final `data: [DONE]`

---

## Current Workaround

A local proxy (`src/proxy.ts`) handles all 3 fixes client-side. It runs on
`http://127.0.0.1:18790` and translates requests/responses between OpenClaw and cdecli-agent.

Once the server fixes are deployed, update the plugin config:

```bash
openclaw config set models.providers.yantra.baseUrl "https://cdecli-agent.cdebase.dev/v1"
```

And the proxy can be removed entirely.
