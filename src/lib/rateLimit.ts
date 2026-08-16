// Simple in-memory IP rate limiter for public API endpoints
const ipStore = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(ip: string, limit = 5, windowMs = 15 * 60 * 1000): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record || now > record.expiresAt) {
    ipStore.set(ip, { count: 1, expiresAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}
