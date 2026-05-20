import { isAdminAuthConfigured, isAdminAuthorized } from "../_lib/adminSession.js";
import { deleteRegistrationById, listRegistrations } from "../_lib/registrationsStore.js";

export default async function handler(req, res) {
  if (!isAdminAuthConfigured()) {
    return res.status(500).json({ error: "Admin password is not configured" });
  }

  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
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
