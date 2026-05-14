import { deleteRegistrationById, listRegistrations } from "../_lib/registrationsStore.js";

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
  const auth = isAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  if (req.method === "GET") {
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

  if (req.method === "DELETE") {
    try {
      const id = req.query?.id || req.body?.id;

      if (!id) {
        return res.status(400).json({
          error: "Registration id is required",
        });
      }

      const removed = await deleteRegistrationById(id);

      if (!removed) {
        return res.status(404).json({
          error: "Registration not found",
        });
      }

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Admin registration delete error:", error);

      return res.status(500).json({
        error: "Failed to delete registration",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
