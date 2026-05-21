export type VoiceProvider = "openai" | "elevenlabs";

export type VoicePlaybackMeta = {
  provider: VoiceProvider;
  voiceId: string;
  voiceLabel: string;
};
