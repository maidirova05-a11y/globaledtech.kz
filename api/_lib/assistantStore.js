const ASSISTANT_KEY_PREFIX = "globaledtech:assistant:conversation:";
const CONVERSATION_TTL_SECONDS = 60 * 60 * 24;
const MAX_STORED_MESSAGES = 16;
const fallbackStore = globalThis.__globalEdTechAssistantStore || new Map();

if (!globalThis.__globalEdTechAssistantStore) {
  globalThis.__globalEdTechAssistantStore = fallbackStore;
}

function getKvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  return {
    url,
    token,
    configured: Boolean(url && token),
  };
}

async function executeKvCommand(command) {
  const { url, token, configured } = getKvConfig();

  if (!configured) {
    throw new Error("KV storage is not configured");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`KV command failed with status ${response.status}: ${errorText}`);
  }

  const result = await response.json();

  if (result?.error) {
    throw new Error(`KV command error: ${result.error}`);
  }

  return result?.result;
}

function getConversationKey(conversationId) {
  return `${ASSISTANT_KEY_PREFIX}${conversationId}`;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message) => message && typeof message.content === "string" && typeof message.role === "string")
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content.trim(),
    }))
    .filter((message) => message.content)
    .slice(-MAX_STORED_MESSAGES);
}

export async function getConversation(conversationId, locale) {
  if (!conversationId) {
    return [];
  }

  const key = getConversationKey(conversationId);
  const { configured } = getKvConfig();

  if (!configured) {
    const record = fallbackStore.get(key);

    if (!record || record.locale !== locale) {
      return [];
    }

    return normalizeMessages(record.messages);
  }

  const rawValue = await executeKvCommand(["GET", key]);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (parsed?.locale !== locale) {
      return [];
    }

    return normalizeMessages(parsed?.messages);
  } catch {
    return [];
  }
}

export async function saveConversation(conversationId, locale, messages) {
  if (!conversationId) {
    return;
  }

  const normalizedMessages = normalizeMessages(messages);
  const payload = JSON.stringify({
    locale,
    messages: normalizedMessages,
    updatedAt: Date.now(),
  });
  const key = getConversationKey(conversationId);
  const { configured } = getKvConfig();

  if (!configured) {
    fallbackStore.set(key, {
      locale,
      messages: normalizedMessages,
      updatedAt: Date.now(),
    });
    return;
  }

  await executeKvCommand(["SETEX", key, String(CONVERSATION_TTL_SECONDS), payload]);
}
