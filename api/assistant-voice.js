import OpenAI from "openai";
import { resolveLocale } from "./_lib/assistantKnowledge.js";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const voiceModel = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const defaultVoice = process.env.OPENAI_TTS_VOICE || "cedar";
const MAX_INPUT_LENGTH = 1200;

const instructionsByLocale = {
  ru: "Speak in Russian with a calm, confident, warm, polished AI assistant tone. Sound natural, clear, and expressive with a deep steady delivery.",
  kk: "Speak in Kazakh with a calm, confident, warm, polished AI assistant tone. Sound natural, clear, and expressive with a deep steady delivery.",
  en: "Speak in English with a calm, confident, warm, polished AI assistant tone. Sound natural, clear, and expressive with a deep steady delivery.",
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

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const input = text.slice(0, MAX_INPUT_LENGTH);
    const audioResponse = await openai.audio.speech.create({
      model: voiceModel,
      voice: defaultVoice,
      input,
      instructions: instructionsByLocale[locale],
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
