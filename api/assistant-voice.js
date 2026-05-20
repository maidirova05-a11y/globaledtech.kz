import OpenAI from "openai";
import { resolveLocale } from "./_lib/assistantKnowledge.js";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const voiceModel = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const fallbackVoice = process.env.OPENAI_TTS_VOICE || "cedar";
const MAX_INPUT_LENGTH = 1200;

const voiceProfiles = {
  assistant: {
    voice: "cedar",
    instructions: {
      ru: "Speak in Russian with a calm, confident, polished AI assistant tone. Sound natural, articulate, and balanced.",
      kk: "Speak in Kazakh with a calm, confident, polished AI assistant tone. Sound natural, articulate, and balanced.",
      en: "Speak in English with a calm, confident, polished AI assistant tone. Sound natural, articulate, and balanced.",
    },
  },
  deep: {
    voice: "onyx",
    instructions: {
      ru: "Speak in Russian with a deeper, steady, cinematic assistant tone. Stay calm, clear, and authoritative without sounding aggressive.",
      kk: "Speak in Kazakh with a deeper, steady, cinematic assistant tone. Stay calm, clear, and authoritative without sounding aggressive.",
      en: "Speak in English with a deeper, steady, cinematic assistant tone. Stay calm, clear, and authoritative without sounding aggressive.",
    },
  },
  warm: {
    voice: "marin",
    instructions: {
      ru: "Speak in Russian with a warm, lively, natural assistant tone. Sound expressive, friendly, and fluid.",
      kk: "Speak in Kazakh with a warm, lively, natural assistant tone. Sound expressive, friendly, and fluid.",
      en: "Speak in English with a warm, lively, natural assistant tone. Sound expressive, friendly, and fluid.",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!openai) {
    return res.status(500).json({
      error: "OpenAI API is not configured",
      code: "OPENAI_NOT_CONFIGURED",
    });
  }

  try {
    const rawBody =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : (req.body ?? {});

    const locale = resolveLocale(rawBody.locale);
    const text = typeof rawBody.text === "string" ? rawBody.text.trim() : "";
    const variant =
      rawBody.variant === "assistant" || rawBody.variant === "deep" || rawBody.variant === "warm"
        ? rawBody.variant
        : "assistant";

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const profile = voiceProfiles[variant];
    const audioResponse = await openai.audio.speech.create({
      model: voiceModel,
      voice: process.env.OPENAI_TTS_VOICE || profile.voice || fallbackVoice,
      input: text.slice(0, MAX_INPUT_LENGTH),
      instructions: profile.instructions[locale],
      response_format: "mp3",
    });

    const buffer = Buffer.from(await audioResponse.arrayBuffer());

    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length,
      "Cache-Control": "no-store",
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
