import {
  clearAdminSessionCookie,
  createAdminSessionCookie,
  isAdminAuthConfigured,
  isAdminAuthorized,
  isAdminPasswordValid,
} from "../_lib/adminSession.js";

export default async function handler(req, res) {
  if (!isAdminAuthConfigured()) {
    return res.status(500).json({
      error: "Admin authentication is not configured",
    });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      authenticated: isAdminAuthorized(req),
    });
  }

  if (req.method === "POST") {
    try {
      const rawBody =
        typeof req.body === "string"
          ? JSON.parse(req.body || "{}")
          : (req.body ?? {});

      const password = typeof rawBody.password === "string" ? rawBody.password.trim() : "";

      if (!password) {
        return res.status(400).json({
          error: "Password is required",
        });
      }

      if (!isAdminPasswordValid(password)) {
        return res.status(401).json({
          error: "Invalid password",
        });
      }

      res.setHeader("Set-Cookie", createAdminSessionCookie());

      return res.status(200).json({
        ok: true,
        authenticated: true,
      });
    } catch (error) {
      console.error("Admin auth error:", error);

      return res.status(500).json({
        error: "Failed to authorize admin",
      });
    }
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearAdminSessionCookie());

    return res.status(200).json({
      ok: true,
      authenticated: false,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
