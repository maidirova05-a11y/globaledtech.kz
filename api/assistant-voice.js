import { resolveLocale } from "./_lib/assistantKnowledge.js";
import { resolveVoiceRuntimeConfig, synthesizeVoice } from "./_lib/voiceProviders.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rawBody =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : (req.body ?? {});

    const locale = resolveLocale(rawBody.locale);
    const text = typeof rawBody.text === "string" ? rawBody.text.trim() : "";

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const runtimeConfig = resolveVoiceRuntimeConfig(locale, rawBody.provider);
    let buffer;

    try {
      buffer = await synthesizeVoice({
        text,
        locale: runtimeConfig.locale,
        provider: runtimeConfig.provider,
        voiceId: runtimeConfig.voiceId,
      });
    } catch (primaryError) {
      if (runtimeConfig.provider !== "openai") {
        console.error("Primary voice provider failed, falling back to OpenAI:", primaryError);

        const fallbackConfig = resolveVoiceRuntimeConfig(locale, "openai");
        buffer = await synthesizeVoice({
          text,
          locale: fallbackConfig.locale,
          provider: fallbackConfig.provider,
          voiceId: fallbackConfig.voiceId,
        });

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
    console.error("AI assistant voice error:", error);

    return res.status(500).json({
      error: "Failed to synthesize assistant voice",
    });
  }
}
