import type { VoiceProvider } from "./types";

export const voiceProviderLabels: Record<VoiceProvider, string> = {
  openai: "OpenAI Voice",
  elevenlabs: "ElevenLabs Voice",
};

export const defaultVoiceLabels: Record<VoiceProvider, string> = {
  openai: "Cedar",
  elevenlabs: "Rachel",
};

export function getVoiceMeta(provider: string | null, voiceId: string | null, voiceLabel: string | null) {
  const normalizedProvider = provider === "elevenlabs" ? "elevenlabs" : "openai";

  return {
    provider: normalizedProvider,
    providerLabel: voiceProviderLabels[normalizedProvider],
    voiceId: voiceId || "default",
    voiceLabel: voiceLabel || defaultVoiceLabels[normalizedProvider],
  };
}
