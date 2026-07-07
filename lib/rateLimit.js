const buckets = new Map();
const MAX_KEYS = 5000;

function prune() {
  if (buckets.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size <= MAX_KEYS) return;
  const excess = buckets.size - MAX_KEYS;
  const it = buckets.keys();
  for (let i = 0; i < excess; i++) {
    const k = it.next().value;
    if (k !== undefined) buckets.delete(k);
  }
}

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
    prune();
  }
  bucket.count += 1;
  return {
    ok: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
