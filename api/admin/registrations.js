import { listRegistrations } from "../_lib/registrationsStore.js";

function isAuthorized(req) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers["x-admin-password"];

  if (!expectedPassword) {
    return {
      ok: false,
      status: 500,
      error: "Admin password is not configured",
    };
  }

  if (!providedPassword || providedPassword !== expectedPassword) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized",
    };
  }

  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = isAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const registrations = await listRegistrations(300);

    return res.status(200).json({
      ok: true,
      registrations,
    });
  } catch (error) {
    console.error("Admin registrations fetch error:", error);

    return res.status(500).json({
      error: "Failed to load registrations",
    });
  }
}
