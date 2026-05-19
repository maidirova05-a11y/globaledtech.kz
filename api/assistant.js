import OpenAI from "openai";
import { buildAssistantInstructions, resolveLocale } from "./_lib/assistantKnowledge.js";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const defaultModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((message) => message && typeof message.content === "string" && typeof message.role === "string")
    .slice(-10)
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content.trim(),
    }))
    .filter((message) => message.content);
}

function extractText(response) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const output = Array.isArray(response.output) ? response.output : [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];

    for (const chunk of content) {
      if (chunk?.type === "output_text" && typeof chunk.text === "string" && chunk.text.trim()) {
        return chunk.text.trim();
      }
    }
  }

  return "";
}

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

    const message = typeof rawBody.message === "string" ? rawBody.message.trim() : "";
    const locale = resolveLocale(rawBody.locale);
    const history = normalizeHistory(rawBody.history);

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await openai.responses.create({
      model: defaultModel,
      max_output_tokens: 260,
      input: [
        {
          role: "system",
          content: buildAssistantInstructions(locale),
        },
        ...history.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        {
          role: "user",
          content: message,
        },
      ],
    });

    const text = extractText(response);

    if (!text) {
      return res.status(502).json({
        error: "Empty response from OpenAI",
      });
    }

    return res.status(200).json({
      ok: true,
      message: text,
      model: defaultModel,
    });
  } catch (error) {
    console.error("AI assistant error:", error);

    return res.status(500).json({
      error: "Failed to generate assistant response",
    });
  }
}
