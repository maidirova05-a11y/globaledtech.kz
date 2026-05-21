# AI Assistant Security Upgrade

## Target Architecture

`Frontend -> Secure Backend API Routes -> AI Providers`

## Updated File Structure

```text
api/
  assistant.js
  assistant-voice.js
  registrations.js
  _lib/
    assistantGuard.js
    assistantSchemas.js
    assistantStore.js
    runMiddleware.js
    sanitize.js
    security.js
    voiceProviders.js
src/
  components/
    ai/
      AIAssistant.tsx
      AssistantErrorBoundary.tsx
      ChatWindow.tsx
      useAssistantController.ts
```

## Security Controls Added

- Backend-only AI requests. Frontend never sends provider API keys.
- Environment-variable driven configuration in `.env.example`.
- `.env` and `.env.*` ignored in `.gitignore`.
- Request validation with `zod`.
- Input sanitization with `DOMPurify`.
- CORS protection with allowlist origins.
- Rate limiting for assistant, voice, and registration routes.
- Secure headers via `helmet` plus explicit hard headers.
- Prompt injection and abuse pattern detection.
- Message length limits and bounded history.
- Timeout protection for OpenAI requests.
- Generic logging only. No raw sensitive payload logging.
- UI error boundary for assistant crashes.
- XSS-safe message rendering on the frontend.

## Backend Routes

### `POST /api/assistant`

- Validates message, locale, history, and conversation ID.
- Sanitizes user input before reaching the model.
- Blocks suspicious prompt-injection attempts.
- Applies CORS, secure headers, and rate limiting.
- Uses a request timeout before provider failure can hang the route.
- Returns a safe fallback if the provider fails.

### `POST /api/assistant-voice`

- Validates text payload and provider selection.
- Enforces separate voice rate limits.
- Keeps TTS provider keys backend-only.

### `POST /api/registrations`

- Sanitizes inbound registration fields.
- Applies the same secure middleware and anti-abuse layer.

## Middleware Stack

Implemented in `api/_lib/security.js`:

- `helmet`
- `cors`
- `express-rate-limit`
- explicit `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`

## Environment Setup

Required secure vars:

```env
APP_ALLOWED_ORIGINS=https://globaledtech-kz.vercel.app,http://localhost:5173
AI_REQUEST_TIMEOUT_MS=18000
AI_MAX_MESSAGE_LENGTH=700
AI_MAX_HISTORY_ITEMS=10
AI_RATE_LIMIT_WINDOW_MS=60000
AI_RATE_LIMIT_MAX=12
AI_VOICE_RATE_LIMIT_MAX=6
AI_REGISTRATION_RATE_LIMIT_MAX=4
AI_BLOCK_SUSPICIOUS_INPUT=true
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
```

## Packages To Install

```bash
npm install helmet cors express-rate-limit dompurify isomorphic-dompurify jsdom
```

## Secure API Example

```js
const security = await applyApiSecurity(req, res, {
  rateLimit: getSecurityConfig().assistant,
});

if (security.ended) return;

const payload = parseAssistantRequest(rawBody);
const promptRisk = detectPromptInjectionRisk(payload.message, payload.history);

if (promptRisk.isSuspicious) {
  return res.status(400).json({
    error: "Suspicious input was blocked",
    fallback: getSafeFallback(payload.locale),
  });
}
```

## Deployment Recommendations

- Store all provider secrets only in Vercel project environment variables.
- Use different keys for development, preview, and production.
- Restrict `APP_ALLOWED_ORIGINS` to real deployment domains.
- Rotate provider keys regularly.
- Add provider billing alerts and anomaly detection.
- Back rate limiting with Redis/Upstash in production if you need durable distributed throttling across instances.
- Add CSP at the edge or framework level for the full app, not only API routes.
- Route logs into a secure sink and avoid request-body logging for assistant routes.

## XSS Review

- No `dangerouslySetInnerHTML` is used in the assistant chat.
- Assistant message text is sanitized before rendering.
- User input is sanitized on the backend before model use and storage.
- URLs are rendered as controlled anchors instead of raw HTML.
