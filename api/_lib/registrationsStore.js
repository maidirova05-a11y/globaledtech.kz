const REGISTRATIONS_KEY = "globaledtech:registrations";

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

export function isRegistrationStoreConfigured() {
  return getKvConfig().configured;
}

export async function appendRegistration(record) {
  await executeKvCommand(["LPUSH", REGISTRATIONS_KEY, JSON.stringify(record)]);
}

export async function listRegistrations(limit = 200) {
  const safeLimit = Math.max(1, Math.min(500, Number(limit) || 200));
  const result = await executeKvCommand(["LRANGE", REGISTRATIONS_KEY, "0", String(safeLimit - 1)]);

  if (!Array.isArray(result)) {
    return [];
  }

  return result
    .map((entry) => {
      try {
        return JSON.parse(entry);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}
