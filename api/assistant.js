import OpenAI from "openai";
import { randomUUID } from "node:crypto";
import { buildAssistantInstructions, resolveLocale } from "./_lib/assistantKnowledge.js";
import { getConversation, saveConversation } from "./_lib/assistantStore.js";

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

function sendSse(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

async function buildInput({ locale, message, history, conversationId }) {
  const storedHistory = await getConversation(conversationId, locale);
  const effectiveHistory = storedHistory.length > 0 ? storedHistory : history;

  return [
    {
      role: "system",
      content: buildAssistantInstructions(locale),
    },
    ...effectiveHistory.map((item) => ({
      role: item.role,
      content: item.content,
    })),
    {
      role: "user",
      content: message,
    },
  ];
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
    const conversationId =
      typeof rawBody.conversationId === "string" && rawBody.conversationId.trim()
        ? rawBody.conversationId.trim()
        : randomUUID();
    const shouldStream = rawBody.stream !== false;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const input = await buildInput({
      locale,
      message,
      history,
      conversationId,
    });

    if (shouldStream) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      });

      if (typeof res.flushHeaders === "function") {
        res.flushHeaders();
      }

      sendSse(res, {
        type: "meta",
        conversationId,
        model: defaultModel,
      });

      let accumulatedText = "";

      try {
        const stream = await openai.responses.create({
          model: defaultModel,
          max_output_tokens: 420,
          stream: true,
          input,
        });

        for await (const event of stream) {
          if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            accumulatedText += event.delta;
            sendSse(res, {
              type: "delta",
              delta: event.delta,
            });
          }
        }

        const finalMessage = accumulatedText.trim();

        if (!finalMessage) {
          throw new Error("Empty response from OpenAI");
        }

        const historyWithoutSystem = input
          .filter((item) => item.role !== "system")
          .map((item) => ({
            role: item.role,
            content: item.content,
          }));

        await saveConversation(conversationId, locale, [
          ...historyWithoutSystem,
          {
            role: "assistant",
            content: finalMessage,
          },
        ]);

        sendSse(res, {
          type: "done",
          conversationId,
          message: finalMessage,
          model: defaultModel,
        });
        res.end();
        return;
      } catch (error) {
        console.error("AI assistant streaming error:", error);

        sendSse(res, {
          type: "error",
          error: "Failed to stream assistant response",
        });
        res.end();
        return;
      }
    }

    const response = await openai.responses.create({
      model: defaultModel,
      max_output_tokens: 360,
      input,
    });

    const text = extractText(response);

    if (!text) {
      return res.status(502).json({
        error: "Empty response from OpenAI",
      });
    }

    const historyWithoutSystem = input
      .filter((item) => item.role !== "system")
      .map((item) => ({
        role: item.role,
        content: item.content,
      }));

    await saveConversation(conversationId, locale, [
      ...historyWithoutSystem,
      {
        role: "assistant",
        content: text,
      },
    ]);

    return res.status(200).json({
      ok: true,
      message: text,
      conversationId,
      model: defaultModel,
    });
  } catch (error) {
    console.error("AI assistant error:", error);

    return res.status(500).json({
      error: "Failed to generate assistant response",
    });
  }
}
