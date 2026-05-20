import crypto from "node:crypto";

const ADMIN_SESSION_COOKIE = "globaledtech_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function toBase64Url(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload) {
  return crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function parseCookies(headerValue) {
  if (!headerValue || typeof headerValue !== "string") {
    return {};
  }

  return headerValue.split(";").reduce((accumulator, cookiePart) => {
    const [name, ...valueParts] = cookiePart.trim().split("=");

    if (!name) {
      return accumulator;
    }

    accumulator[name] = valueParts.join("=");
    return accumulator;
  }, {});
}

function buildCookieAttributes(maxAgeSeconds) {
  const attributes = [
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`,
  ];

  if (process.env.NODE_ENV === "production") {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminPasswordValid(password) {
  const expectedPassword = getAdminPassword();

  if (!expectedPassword) {
    return false;
  }

  return safeCompare(String(password || ""), expectedPassword);
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPassword() && getSessionSecret());
}

export function createAdminSessionCookie() {
  const now = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({
    iat: now,
    exp: now + SESSION_DURATION_SECONDS,
  });
  const encodedPayload = toBase64Url(payload);
  const signature = signPayload(encodedPayload);

  return `${ADMIN_SESSION_COOKIE}=${encodedPayload}.${signature}; ${buildCookieAttributes(
    SESSION_DURATION_SECONDS,
  )}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_SESSION_COOKIE}=; ${buildCookieAttributes(0)}`;
}

export function isAdminAuthorized(req) {
  if (!isAdminAuthConfigured()) {
    return false;
  }

  const cookies = parseCookies(req.headers?.cookie);
  const rawToken = cookies[ADMIN_SESSION_COOKIE];

  if (!rawToken) {
    return false;
  }

  const [encodedPayload, signature] = rawToken.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = signPayload(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    return false;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    const exp = Number(payload?.exp || 0);

    return exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
