import { createHmac } from "crypto";

export function getRateLimitConfig() {
  return {
    max: Number(process.env.CONTACT_RATE_LIMIT_MAX || 5),
    windowSeconds: Number(process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS || 900),
  };
}

export function hashRateLimitIdentity(identity: string, secret: string) {
  return createHmac("sha256", secret).update(identity).digest("hex");
}

export function getRateLimitKey(identity: string, secret: string, now = Date.now()) {
  const { windowSeconds } = getRateLimitConfig();
  const windowId = Math.floor(now / (windowSeconds * 1000));
  return {
    key: `${hashRateLimitIdentity(identity, secret)}:${windowId}`,
    windowId,
    expiresAt: new Date((windowId + 2) * windowSeconds * 1000),
  };
}
