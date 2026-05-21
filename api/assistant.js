import OpenAI from "openai";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { buildProtectedUserPrompt, detectPromptInjectionRisk, getSafeFallback } from "./_lib/assistantGuard.js";
import { parseAssistantRequest } from "./_lib/assistantSchemas.js";
import { buildAssistantInstructions, resolveLocale } from "./_lib/assistantKnowledge.js";
import { applyApiSecurity, getSecurityConfig } from "./_lib/security.js";
import { getConversation, saveConversation } from "./_lib/assistantStore.js";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const defaultModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const REQUEST_TIMEOUT_MS = Number(process.env.AI_REQUEST_TIMEOUT_MS || 18_000);
const MAX_HISTORY_ITEMS = Number(process.env.AI_MAX_HISTORY_ITEMS || 10);

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((message) => message && typeof message.content === "string" && typeof message.role === "string")
    .slice(-MAX_HISTORY_ITEMS)
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
  const guardedUserMessage = buildProtectedUserPrompt(message);

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
      content: guardedUserMessage,
    },
  ];
}

function createRequestTimeoutController() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort("timeout"), REQUEST_TIMEOUT_MS);

  return {
    signal: controller.signal,
    clear() {
      clearTimeout(timeoutId);
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const security = await applyApiSecurity(req, res, {
    rateLimit: getSecurityConfig().assistant,
  });

  if (security.ended) {
    return;
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

    const payload = parseAssistantRequest(rawBody);
    const message = payload.message;
    const locale = resolveLocale(payload.locale);
    const history = normalizeHistory(payload.history);
    const conversationId = payload.conversationId?.trim() || randomUUID();
    const shouldStream = payload.stream !== false;
    const promptRisk = detectPromptInjectionRisk(message, history);

    if (String(process.env.AI_BLOCK_SUSPICIOUS_INPUT || "true") !== "false" && promptRisk.isSuspicious) {
      return res.status(400).json({
        error: "Suspicious input was blocked",
        fallback: getSafeFallback(locale),
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
      const requestTimeout = createRequestTimeoutController();

      try {
        const stream = await openai.responses.create({
          model: defaultModel,
          max_output_tokens: 420,
          stream: true,
          input,
          signal: requestTimeout.signal,
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
        console.error("AI assistant streaming error:", error instanceof Error ? error.message : "unknown");

        sendSse(res, {
          type: "error",
          error: "Failed to stream assistant response",
        });
        res.end();
        return;
      } finally {
        requestTimeout.clear();
      }
    }

    const requestTimeout = createRequestTimeoutController();
    let response;

    try {
      response = await openai.responses.create({
        model: defaultModel,
        max_output_tokens: 360,
        input,
        signal: requestTimeout.signal,
      });
    } finally {
      requestTimeout.clear();
    }

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
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        issues: error.flatten(),
      });
    }

    console.error("AI assistant error:", error instanceof Error ? error.message : "unknown");

    return res.status(500).json({
      error: "Failed to generate assistant response",
      fallback: getSafeFallback(resolveLocale(req.body?.locale)),
    });
  }
}
