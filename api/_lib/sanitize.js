import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const { window } = new JSDOM("");
const DOMPurify = createDOMPurify(window);
const DEFAULT_STRING_LIMIT = Number(process.env.AI_MAX_MESSAGE_LENGTH || 700);

function cleanString(value, maxLength = DEFAULT_STRING_LIMIT) {
  const normalized = String(value ?? "")
    .replace(/\0/g, "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, maxLength);

  return DOMPurify.sanitize(normalized, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

export function sanitizeUserText(value, maxLength = DEFAULT_STRING_LIMIT) {
  return cleanString(value, maxLength);
}

export function sanitizeMessageHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((message) => ({
      role: message?.role === "assistant" ? "assistant" : "user",
      content: cleanString(message?.content ?? ""),
    }))
    .filter((message) => message.content);
}

export function sanitizeUnknownObject(input) {
  if (!input || typeof input !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, cleanString(value)];
      }

      if (Array.isArray(value)) {
        return [key, value.map((item) => (typeof item === "string" ? cleanString(item) : item)).slice(0, 20)];
      }

      return [key, value];
    }),
  );
}
