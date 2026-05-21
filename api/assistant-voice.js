import { z } from "zod";
import { parseAssistantVoiceRequest } from "./_lib/assistantSchemas.js";
import { applyApiSecurity, getSecurityConfig } from "./_lib/security.js";
import { resolveVoiceRuntimeConfig, synthesizeVoice } from "./_lib/voiceProviders.js";

const REQUEST_TIMEOUT_MS = Number(process.env.AI_REQUEST_TIMEOUT_MS || 18_000);

async function withTimeout(task) {
  return await Promise.race([
    task(),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Voice request timeout")), REQUEST_TIMEOUT_MS);
    }),
  ]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const security = await applyApiSecurity(req, res, {
    rateLimit: getSecurityConfig().voice,
  });

  if (security.ended) {
    return;
  }

  try {
    const rawBody =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : (req.body ?? {});

    const payload = parseAssistantVoiceRequest(rawBody);
    const locale = payload.locale;
    const text = payload.text;

    const runtimeConfig = resolveVoiceRuntimeConfig(locale, rawBody.provider);
    let buffer;

    try {
      buffer = await withTimeout(() => synthesizeVoice({
        text,
        locale: runtimeConfig.locale,
        provider: runtimeConfig.provider,
        voiceId: runtimeConfig.voiceId,
      }));
    } catch (primaryError) {
      if (runtimeConfig.provider !== "openai") {
        console.error("Primary voice provider failed, falling back to OpenAI:", primaryError);

        const fallbackConfig = resolveVoiceRuntimeConfig(locale, "openai");
        buffer = await withTimeout(() => synthesizeVoice({
          text,
          locale: fallbackConfig.locale,
          provider: fallbackConfig.provider,
          voiceId: fallbackConfig.voiceId,
        }));

        runtimeConfig.provider = fallbackConfig.provider;
        runtimeConfig.voiceId = fallbackConfig.voiceId;
        runtimeConfig.voiceLabel = fallbackConfig.voiceLabel;
      } else {
        throw primaryError;
      }
    }

    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length,
      "Cache-Control": "no-store",
      "x-voice-provider": runtimeConfig.provider,
      "x-voice-id": runtimeConfig.voiceId,
      "x-voice-label": runtimeConfig.voiceLabel,
    });

    res.end(buffer);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        issues: error.flatten(),
      });
    }

    console.error("AI assistant voice error:", error instanceof Error ? error.message : "unknown");

    return res.status(500).json({
      error: "Failed to synthesize assistant voice",
    });
  }
}
