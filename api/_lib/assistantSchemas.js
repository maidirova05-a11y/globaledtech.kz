import { z } from "zod";
import { sanitizeMessageHistory, sanitizeUserText } from "./sanitize.js";

const MAX_MESSAGE_LENGTH = Number(process.env.AI_MAX_MESSAGE_LENGTH || 700);
const MAX_HISTORY_ITEMS = Number(process.env.AI_MAX_HISTORY_ITEMS || 10);

const localeSchema = z.enum(["ru", "kk", "en"]).default("ru");

const historyItemSchema = z.object({
  role: z.enum(["assistant", "user"]),
  content: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});

export const assistantRequestSchema = z.object({
  message: z.string().min(1).max(MAX_MESSAGE_LENGTH),
  locale: localeSchema,
  conversationId: z.string().trim().min(8).max(120).optional(),
  stream: z.boolean().optional().default(true),
  history: z.array(historyItemSchema).max(MAX_HISTORY_ITEMS).default([]),
});

export const assistantVoiceSchema = z.object({
  text: z.string().min(1).max(MAX_MESSAGE_LENGTH),
  locale: localeSchema,
  provider: z.enum(["openai", "elevenlabs"]).optional(),
});

export function parseAssistantRequest(rawBody) {
  return assistantRequestSchema.parse({
    ...rawBody,
    message: sanitizeUserText(rawBody?.message ?? "", MAX_MESSAGE_LENGTH),
    history: sanitizeMessageHistory(rawBody?.history).slice(-MAX_HISTORY_ITEMS),
  });
}

export function parseAssistantVoiceRequest(rawBody) {
  return assistantVoiceSchema.parse({
    ...rawBody,
    text: sanitizeUserText(rawBody?.text ?? "", MAX_MESSAGE_LENGTH),
  });
}
