import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { runMiddleware } from "./runMiddleware.js";

const allowedOrigins = (process.env.APP_ALLOWED_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const limiterStore = globalThis.__globalEdTechRateLimiterStore || new Map();

if (!globalThis.__globalEdTechRateLimiterStore) {
  globalThis.__globalEdTechRateLimiterStore = limiterStore;
}

function buildCorsMiddleware() {
  return cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 86400,
  });
}

function buildRateLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: {
      async increment(key) {
        const now = Date.now();
        const current = limiterStore.get(key);

        if (!current || current.resetTime <= now) {
          const resetTime = new Date(now + windowMs);
          limiterStore.set(key, { totalHits: 1, resetTime: resetTime.getTime() });
          return { totalHits: 1, resetTime };
        }

        current.totalHits += 1;
        limiterStore.set(key, current);
        return { totalHits: current.totalHits, resetTime: new Date(current.resetTime) };
      },
      async decrement(key) {
        const current = limiterStore.get(key);
        if (current?.totalHits > 0) {
          current.totalHits -= 1;
          limiterStore.set(key, current);
        }
      },
      async resetKey(key) {
        limiterStore.delete(key);
      },
    },
    keyGenerator(req) {
      return req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
    },
    handler(_req, res) {
      res.status(429).json({ error: message });
    },
  });
}

function applyHardHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cache-Control", "no-store");
}

export async function applyApiSecurity(req, res, options = {}) {
  applyHardHeaders(res);

  const helmetMiddleware = helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  });
  const corsMiddleware = buildCorsMiddleware();

  if (req.method === "OPTIONS") {
    await runMiddleware(req, res, corsMiddleware);
    res.status(204).end();
    return { ended: true };
  }

  await runMiddleware(req, res, helmetMiddleware);
  await runMiddleware(req, res, corsMiddleware);

  if (options.rateLimit) {
    await runMiddleware(req, res, buildRateLimiter(options.rateLimit));
  }

  return { ended: false };
}

export function getSecurityConfig() {
  return {
    assistant: {
      windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60_000),
      max: Number(process.env.AI_RATE_LIMIT_MAX || 12),
      message: "Too many assistant requests. Please slow down and try again shortly.",
    },
    voice: {
      windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60_000),
      max: Number(process.env.AI_VOICE_RATE_LIMIT_MAX || 6),
      message: "Too many voice requests. Please try again in a moment.",
    },
    registration: {
      windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60_000),
      max: Number(process.env.AI_REGISTRATION_RATE_LIMIT_MAX || 4),
      message: "Too many requests. Please wait a bit before sending again.",
    },
  };
}
