import { createHash } from "node:crypto";
import { isIP } from "node:net";

export type LimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
  retryAfterSeconds: number;
};

type Bucket = { count: number; resetAt: number };
type RedisConfig = { url: string; token: string };

const WINDOW_SECONDS = 24 * 60 * 60;
const DEFAULT_VISITOR_LIMIT = 10;
const DEFAULT_DAILY_LIMIT = 100;
const MAX_VISITOR_BUCKETS = 5_000;
const REDIS_TIMEOUT_MS = 3_000;
// INCR and EXPIRE must be atomic. Checking the TTL after INCR also gives a counter that lost its
// expiry a new one, so a stuck key can't block every visitor forever.
const COUNTER_SCRIPT = [
  "local count = redis.call('INCR', KEYS[1])",
  "local ttl = redis.call('TTL', KEYS[1])",
  "if ttl < 0 then redis.call('EXPIRE', KEYS[1], ARGV[1]); ttl = tonumber(ARGV[1]) end",
  "return {count, ttl}",
].join("\n");

// Separate maps keep a flood of new visitors from evicting the shared daily counter.
const visitorBuckets = new Map<string, Bucket>();
const budgetBuckets = new Map<string, Bucket>();
const warnedEnvNames = new Set<string>();
let warnedAboutMemoryStore = false;

function readLimit(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;

  const value = Number(raw);
  if (Number.isSafeInteger(value) && value >= 0) return value;
  if (!warnedEnvNames.has(name)) {
    warnedEnvNames.add(name);
    console.warn(`${name} must be a whole number of 0 or more; using ${fallback}.`);
  }
  return fallback;
}

// Accepts the KV_* names that some Vercel and Upstash integrations inject.
function getRedisConfig(): RedisConfig | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();
  if (!url && !token) return null;
  if (!url || !token) {
    throw new Error("Both the Upstash REST URL and token are required for usage limits.");
  }
  // fetch() puts an unparseable URL in its error message, which would copy a pasted secret into the logs.
  if (!URL.canParse(url) || new URL(url).protocol !== "https:") {
    throw new Error(
      "The Upstash REST URL must be the https:// address from the Upstash console, not a redis:// connection string or another value.",
    );
  }
  return { url: url.replace(/\/+$/, ""), token };
}

async function consumeFromRedis(
  redis: RedisConfig,
  key: string,
  limit: number,
): Promise<LimitResult> {
  const response = await fetch(redis.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redis.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(["EVAL", COUNTER_SCRIPT, "1", key, String(WINDOW_SECONDS)]),
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Upstash usage limiter returned status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("result" in payload) ||
    !Array.isArray(payload.result) ||
    typeof payload.result[0] !== "number" ||
    typeof payload.result[1] !== "number"
  ) {
    throw new Error("Upstash usage limiter returned an invalid response.");
  }

  const [count, ttl] = payload.result;
  const allowed = count <= limit;
  return { allowed, count, limit, retryAfterSeconds: allowed ? 0 : Math.max(1, ttl) };
}

function consumeFromMemory(
  buckets: Map<string, Bucket>,
  maxBuckets: number,
  key: string,
  limit: number,
): LimitResult {
  const now = Date.now();
  for (const [bucketKey, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(bucketKey);
  }

  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= maxBuckets) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey !== undefined) buckets.delete(oldestKey);
    }
    bucket = { count: 0, resetAt: now + WINDOW_SECONDS * 1000 };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  const allowed = bucket.count <= limit;
  return {
    allowed,
    count: bucket.count,
    limit,
    retryAfterSeconds: allowed ? 0 : Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

async function consume(
  buckets: Map<string, Bucket>,
  maxBuckets: number,
  key: string,
  limit: number,
): Promise<LimitResult> {
  // `next dev` isn't open to visitors, and attempts that fail while the setup is being fixed
  // shouldn't use up the quota or touch the production counters in a shared Redis.
  if (process.env.NODE_ENV === "development") {
    return { allowed: true, count: 0, limit, retryAfterSeconds: 0 };
  }

  const redis = getRedisConfig();
  if (redis) return consumeFromRedis(redis, key, limit);

  // Serverless instances don't share memory, so a per-instance count would let anyone get past
  // the caps by reaching a fresh instance. The route turns these errors into a 503.
  if (process.env.VERCEL) {
    throw new Error("Upstash isn't configured, so usage limits can't be enforced on Vercel.");
  }

  // VERCEL isn't always set, and other hosts can be serverless too, so in production a memory
  // count has to be chosen on purpose by someone running a single long-lived server.
  if (process.env.NODE_ENV === "production") {
    if (process.env.UX_ARCHITECT_ALLOW_MEMORY_STORE !== "1") {
      throw new Error(
        "Upstash isn't configured, so usage limits can't be enforced. A single long-lived server can set UX_ARCHITECT_ALLOW_MEMORY_STORE=1 to count in memory instead.",
      );
    }
    if (!warnedAboutMemoryStore) {
      warnedAboutMemoryStore = true;
      console.warn(
        "UX Architect: Upstash isn't configured, so usage limits are kept per server instance and reset on restart.",
      );
    }
  }
  return consumeFromMemory(buckets, maxBuckets, key, limit);
}

function ipv6Groups(address: string): number[] {
  let text = address;
  const lastColon = text.lastIndexOf(":");
  if (text.slice(lastColon + 1).includes(".")) {
    const [a, b, c, d] = text.slice(lastColon + 1).split(".").map(Number);
    text = `${text.slice(0, lastColon + 1)}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const [head, tail] = text.split("::");
  const front = head ? head.split(":") : [];
  const back = tail ? tail.split(":") : [];
  const gap = tail === undefined ? 0 : 8 - front.length - back.length;
  return [...front, ...Array<string>(gap).fill("0"), ...back].map((group) => parseInt(group, 16));
}

// Whoever has an IPv6 address usually controls its whole /64, which is far too many addresses to
// count one by one. Those visitors share one count, and IPv4-mapped addresses use their IPv4 form.
export function visitorGroup(address: string): string {
  const bare = address.trim().replace(/^\[|\]$/g, "").split("%")[0];
  if (isIP(bare) !== 6) return address;

  const groups = ipv6Groups(bare);
  if (groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff) {
    return `${groups[6] >> 8}.${groups[6] & 255}.${groups[7] >> 8}.${groups[7] & 255}`;
  }
  const prefix = groups.slice(0, 4).map((group) => group.toString(16).padStart(4, "0"));
  return `${prefix.join(":")}::/64`;
}

// Counts one generation attempt for a visitor. Every call counts, whether or not it is allowed,
// except on the local dev server.
export function consumeVisitorLimit(address: string): Promise<LimitResult> {
  const digest = createHash("sha256").update(visitorGroup(address)).digest("hex");
  const key = `ux-architect:visitor:${digest}`;
  return consume(
    visitorBuckets,
    MAX_VISITOR_BUCKETS,
    key,
    readLimit("UX_ARCHITECT_VISITOR_LIMIT", DEFAULT_VISITOR_LIMIT),
  );
}

// Counts one generation attempt against the total shared by every visitor.
export function consumeDailyBudget(): Promise<LimitResult> {
  return consume(
    budgetBuckets,
    1,
    "ux-architect:daily-budget",
    readLimit("UX_ARCHITECT_DAILY_LIMIT", DEFAULT_DAILY_LIMIT),
  );
}
