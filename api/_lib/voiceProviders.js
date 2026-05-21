import OpenAI from "openai";
import { resolveLocale } from "./assistantKnowledge.js";

const MAX_INPUT_LENGTH = 1200;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const openAiInstructions = {
  ru: "Speak in Russian with a natural, warm, premium event-assistant voice. Use brief pauses and smooth intonation.",
  kk: "Speak in Kazakh with a natural, warm, premium event-assistant voice. Use brief pauses and smooth intonation.",
  en: "Speak in English with a natural, warm, premium event-assistant voice. Use brief pauses and smooth intonation.",
};

const elevenLabsModels = {
  default: "eleven_multilingual_v2",
  turbo: "eleven_turbo_v2_5",
};

function trimInput(text) {
  return String(text || "").trim().slice(0, MAX_INPUT_LENGTH);
}

export function resolveVoiceRuntimeConfig(locale, requestedProvider) {
  const normalizedLocale = resolveLocale(locale);
  const provider =
    requestedProvider ||
    process.env.VOICE_PROVIDER ||
    (process.env.ELEVENLABS_API_KEY ? "elevenlabs" : "openai");

  const normalizedProvider = provider === "elevenlabs" ? "elevenlabs" : "openai";
  const voiceId =
    normalizedProvider === "elevenlabs"
      ? process.env.ELEVENLABS_VOICE_ID || process.env.VITE_ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL"
      : process.env.OPENAI_TTS_VOICE || "cedar";
  const voiceLabel =
    normalizedProvider === "elevenlabs"
      ? process.env.ELEVENLABS_VOICE_LABEL || "Rachel"
      : process.env.OPENAI_TTS_VOICE_LABEL || voiceId;

  return {
    locale: normalizedLocale,
    provider: normalizedProvider,
    voiceId,
    voiceLabel,
  };
}

async function synthesizeWithOpenAI({ text, locale, voiceId }) {
  if (!openai) {
    throw new Error("OpenAI API is not configured");
  }

  const audioResponse = await openai.audio.speech.create({
    model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
    voice: voiceId,
    input: trimInput(text),
    instructions: openAiInstructions[locale],
    response_format: "mp3",
  });

  return Buffer.from(await audioResponse.arrayBuffer());
}

async function synthesizeWithElevenLabs({ text, locale, voiceId }) {
  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error("ElevenLabs API key is not configured");
  }

  const stability = Number(process.env.ELEVENLABS_STABILITY || 0.45);
  const similarityBoost = Number(process.env.ELEVENLABS_SIMILARITY_BOOST || 0.78);
  const style = Number(process.env.ELEVENLABS_STYLE || 0.28);

  const prompt =
    locale === "ru"
      ? "Озвучь дружелюбно, современно, естественно, с легкими паузами, как живой AI-консультант международного форума."
      : locale === "kk"
        ? "Мәтінді достық, заманауи, табиғи түрде, шағын паузалармен, халықаралық форумның тірі AI-кеңесшісі сияқты дыбыста."
        : "Deliver this in a warm, modern, natural way with light pauses, like a live AI event consultant.";

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      model_id: process.env.ELEVENLABS_MODEL_ID || elevenLabsModels.default,
      text: trimInput(text),
      language_code: locale === "kk" ? "kk" : locale,
      previous_text: "",
      next_text: "",
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
        style,
        use_speaker_boost: true,
      },
      pronunciation_dictionary_locators: [],
      seed: 7,
      text_normalization: "auto",
      optimize_streaming_latency: 1,
      style: 0,
      prompt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs request failed with status ${response.status}: ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function synthesizeVoice({ text, locale, provider, voiceId }) {
  if (provider === "elevenlabs") {
    return synthesizeWithElevenLabs({ text, locale, voiceId });
  }

  return synthesizeWithOpenAI({ text, locale, voiceId });
}
