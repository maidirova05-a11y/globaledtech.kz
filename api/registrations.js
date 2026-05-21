import { parseRegistrationPayload } from "../src/lib/registrationSchema.js";
import { sanitizeUnknownObject } from "./_lib/sanitize.js";
import { applyApiSecurity, getSecurityConfig } from "./_lib/security.js";
import {
  appendRegistration,
  isRegistrationStoreConfigured,
} from "./_lib/registrationsStore.js";

function createRegistrationRecord(payload) {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: payload.name,
    surname: payload.surname,
    email: payload.email,
    phone: payload.phone,
    company: payload.company,
    participationType: payload.participationType,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const security = await applyApiSecurity(req, res, {
    rateLimit: getSecurityConfig().registration,
  });

  if (security.ended) {
    return;
  }

  if (!isRegistrationStoreConfigured()) {
    return res.status(500).json({
      error: "Registration database is not configured",
    });
  }

  try {
    const rawBody =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : (req.body ?? {});

    const payload = parseRegistrationPayload(sanitizeUnknownObject(rawBody));
    const record = createRegistrationRecord(payload);

    await appendRegistration(record);

    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        issues: error.issues,
      });
    }

    console.error("Registration save error:", error instanceof Error ? error.message : "unknown");

    return res.status(500).json({
      error: "Failed to save registration",
    });
  }
}
