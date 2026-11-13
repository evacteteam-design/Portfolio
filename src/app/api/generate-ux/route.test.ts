import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { afterEach, beforeEach, mock, test } from "node:test";
import { NextRequest } from "next/server";
import { isUXArchitectureResponse } from "@/types/ux-architect";
import { uxArchitectureSchema } from "@/lib/ux-architect";
import { consumeDailyBudget, consumeVisitorLimit, visitorGroup } from "@/lib/ux-architect-limits";
import { POST } from "./route";

const envNames = [
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "UX_ARCHITECT_DAILY_LIMIT",
  "UX_ARCHITECT_VISITOR_LIMIT",
  "UX_ARCHITECT_ALLOW_MEMORY_STORE",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
  "VERCEL",
] as const;
const originalEnv = envNames.map((name) => [name, process.env[name]] as const);
const originalNodeEnv = process.env.NODE_ENV;
const upstashUrl = "https://limits.example.upstash.io";
type NextRequestInit = NonNullable<ConstructorParameters<typeof NextRequest>[1]>;
let requestNumber = 0;

// Next types NODE_ENV as read-only, but the route behaves differently under `next dev` and in production.
function setNodeEnv(value: string | undefined) {
  const env = process.env as Record<string, string | undefined>;
  if (value === undefined) delete env.NODE_ENV;
  else env.NODE_ENV = value;
}

beforeEach(() => {
  for (const name of envNames) delete process.env[name];
  // The usage limits depend on NODE_ENV, so don't inherit it from whoever runs the tests.
  setNodeEnv("test");
  process.env.OPENAI_API_KEY = "test-key-not-a-real-credential";
  mock.method(console, "error", () => {});
  mock.method(console, "warn", () => {});
  mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected network request in a unit test.");
  });
});

afterEach(() => {
  mock.restoreAll();
  setNodeEnv(originalNodeEnv);
  for (const [name, value] of originalEnv) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

function request({
  headers = {},
  ip = `openai-route-test-${++requestNumber}`,
}: { headers?: Record<string, string>; ip?: string } = {}) {
  return new NextRequest("http://localhost/api/generate-ux", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-real-ip": ip,
      ...headers,
    },
    body: JSON.stringify({
      idea: "An app for neighbors to borrow and lend gardening tools.",
      platform: "Mobile app",
    }),
  });
}

// Counts like the production Redis script does, and treats every other request as OpenAI.
function mockUpstashAndOpenAI(options: { upstashStatus?: number } = {}) {
  const counters = new Map<string, number>();
  let generations = 0;
  mock.method(globalThis, "fetch", async (input: string | URL | Request, init?: RequestInit) => {
    if (String(input).startsWith(upstashUrl)) {
      if (options.upstashStatus) {
        return new Response("Unavailable", { status: options.upstashStatus });
      }
      const [, , , key] = JSON.parse(String(init?.body)) as string[];
      const count = (counters.get(key) ?? 0) + 1;
      counters.set(key, count);
      return Response.json({ result: [count, 86_400] });
    }
    generations += 1;
    return Response.json(completedOutput(brief()));
  });
  return { counters, generations: () => generations };
}

function brief() {
  return {
    quickAnswer: {
      answer: "Start small: share the tools neighbors already own before buying inventory.",
      steps: Array.from({ length: 3 }, (_, index) => ({
        title: `Step ${index + 1}`,
        detail: "Ask five neighbors which tools they would lend.",
      })),
    },
    projectTitle: "Neighborhood tool library",
    valueProposition: "Borrow tools from nearby neighbors.",
    researchNote: "AI-generated hypotheses that require validation with real users.",
    personas: Array.from({ length: 3 }, (_, index) => ({
      archetype: `Gardener ${index + 1}`,
      context: "Maintains a small garden.",
      primaryGoal: "Find a nearby tool.",
      coreFrustration: "Buying rarely used tools is expensive.",
      keyBehavior: "Plans gardening on weekends.",
      techComfort: "Comfortable with mobile apps.",
    })),
    journey: Array.from({ length: 5 }, (_, index) => ({
      stageName: `Stage ${index + 1}`,
      userAction: "Check tool availability.",
      emotionalState: "Hopeful",
      friction: "Unclear pickup times.",
      uxOpportunity: "Show available pickup slots.",
    })),
    wireframes: Array.from({ length: 3 }, (_, index) => ({
      screenName: `Screen ${index + 1}`,
      purpose: "Find and reserve a tool.",
      blocks: ["header", "list", "cta"].map((type) => ({
        type,
        label: "Available tools",
        annotation: "Help neighbors choose a tool.",
      })),
    })),
  };
}

function completedOutput(value: unknown) {
  return {
    status: "completed",
    output: [
      { type: "reasoning", summary: [] },
      {
        type: "message",
        content: [{ type: "output_text", text: JSON.stringify(value) }],
      },
    ],
  };
}

test("uses the documented OpenAI model and renders Responses API output as a validated brief", async () => {
  const generated = brief();
  const provider = mock.method(globalThis, "fetch", async () =>
    Response.json(completedOutput(generated)),
  );

  const response = await POST(request());
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.ok(isUXArchitectureResponse(payload.result));
  assert.deepEqual(payload.result, generated);

  assert.equal(provider.mock.callCount(), 1);
  const [url, options] = provider.mock.calls[0].arguments;
  assert.equal(url, "https://api.openai.com/v1/responses");
  assert.equal(options?.method, "POST");
  assert.equal(
    new Headers(options?.headers).get("Authorization"),
    "Bearer test-key-not-a-real-credential",
  );
  assert.equal(typeof options?.body, "string");
  const body = JSON.parse(String(options?.body));
  assert.equal(body.model, "gpt-5-mini");
  assert.equal(body.store, false);
  assert.deepEqual(body.reasoning, { effort: "medium" });
  assert.match(body.input, /gardening tools/);
  assert.match(body.instructions, /Mobile app/);
  assert.deepEqual(body.text.format, {
    type: "json_schema",
    name: "ux_architecture",
    strict: true,
    schema: uxArchitectureSchema,
  });
});

test("honors a configured OpenAI API model snapshot", async () => {
  process.env.OPENAI_MODEL = " gpt-5-mini-2025-08-07 ";
  const provider = mock.method(globalThis, "fetch", async () =>
    Response.json(completedOutput(brief())),
  );

  assert.equal((await POST(request())).status, 200);
  const options = provider.mock.calls[0].arguments[1];
  assert.equal(JSON.parse(String(options?.body)).model, "gpt-5-mini-2025-08-07");
});

test("returns a configuration error without contacting OpenAI when the key is missing", async () => {
  process.env.OPENAI_API_KEY = " ";
  const provider = mock.method(globalThis, "fetch");
  const response = await POST(request());

  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /isn't configured/);
  assert.equal(provider.mock.callCount(), 0);
});

test("rejects refused, truncated, and invalid OpenAI responses", async () => {
  const invalidBrief = brief();
  invalidBrief.personas.pop();
  const missingAdvice = brief();
  missingAdvice.quickAnswer.steps.pop();
  const cases = [
    {
      payload: {
        status: "completed",
        output: [{ type: "message", content: [{ type: "refusal", refusal: "Refused." }] }],
      },
      status: 422,
      message: /rephrasing/,
    },
    {
      payload: {
        ...completedOutput(brief()),
        status: "incomplete",
        incomplete_details: { reason: "max_output_tokens" },
      },
      status: 502,
      message: /cut off/,
    },
    { payload: completedOutput(invalidBrief), status: 502, message: /incomplete brief/ },
    { payload: completedOutput(missingAdvice), status: 502, message: /incomplete brief/ },
  ];

  for (const scenario of cases) {
    const provider = mock.method(globalThis, "fetch", async () =>
      Response.json(scenario.payload),
    );
    const response = await POST(request());
    assert.equal(response.status, scenario.status);
    const payload = await response.json();
    assert.match(payload.error, scenario.message);
    assert.equal(payload.result, undefined);
    provider.mock.restore();
  }
});

test("distinguishes OpenAI quota exhaustion from a retryable rate limit", async () => {
  for (const code of ["insufficient_quota", "rate_limit_exceeded"]) {
    const provider = mock.method(globalThis, "fetch", async () =>
      Response.json({ error: { code, message: "Provider error." } }, { status: 429 }),
    );
    const response = await POST(request());
    assert.equal(response.status, 503);
    assert.match(
      (await response.json()).error,
      code === "insufficient_quota" ? /temporarily unavailable/ : /busy/,
    );
    provider.mock.restore();
  }
});

test("shows visitors a generic message when OpenAI rejects the key or the model", async () => {
  const rejections = [
    { status: 401, code: "invalid_api_key" },
    { status: 404, code: "model_not_found" },
  ];
  for (const { status, code } of rejections) {
    const provider = mock.method(globalThis, "fetch", async () =>
      Response.json(
        { error: { code, message: "Incorrect API key provided: sk-proj-****abcd." } },
        { status },
      ),
    );
    const response = await POST(request());
    assert.equal(response.status, 503);
    const { error } = await response.json();
    assert.match(error, /temporarily unavailable/);
    assert.doesNotMatch(error, /sk-proj|OPENAI_/);
    provider.mock.restore();
  }
});

test("tells the developer what to fix when running the local dev server", async () => {
  setNodeEnv("development");
  const failures = [
    { status: 401, code: "invalid_api_key", message: /OPENAI_API_KEY/ },
    { status: 404, code: "model_not_found", message: /OPENAI_MODEL/ },
    { status: 429, code: "insufficient_quota", message: /billing problem/ },
    {
      status: 400,
      code: "invalid_json_schema",
      message: /400 invalid_json_schema: Invalid schema for response_format/,
    },
  ];
  for (const { status, code, message } of failures) {
    const provider = mock.method(globalThis, "fetch", async () =>
      Response.json(
        {
          error: {
            code,
            message: "Invalid schema for response_format. Incorrect API key provided: sk-proj-****abcd.",
          },
        },
        { status },
      ),
    );
    const { error } = await (await POST(request())).json();
    assert.match(error, message);
    if (status === 401) assert.doesNotMatch(error, /sk-proj/);
    provider.mock.restore();
  }
});

test("doesn't count attempts against the usage caps on the local dev server", async () => {
  setNodeEnv("development");
  process.env.UPSTASH_REDIS_REST_URL = upstashUrl;
  process.env.UPSTASH_REDIS_REST_TOKEN = "upstash-token-not-a-real-credential";
  process.env.UX_ARCHITECT_VISITOR_LIMIT = "1";
  process.env.UX_ARCHITECT_DAILY_LIMIT = "0";
  const services = mockUpstashAndOpenAI();

  const ip = "openai-route-test-dev-visitor";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    assert.equal((await POST(request({ ip }))).status, 200);
  }
  assert.equal(services.generations(), 3);
  assert.equal(services.counters.size, 0);
});

test("returns a timeout error instead of a successful or incomplete brief", async () => {
  mock.method(globalThis, "fetch", async () => {
    throw new DOMException("The operation timed out.", "TimeoutError");
  });

  const response = await POST(request());
  assert.equal(response.status, 504);
  const payload = await response.json();
  assert.match(payload.error, /took too long/);
  assert.equal(payload.result, undefined);
});

test("rejects cross-site requests before spending a generation", async () => {
  const provider = mock.method(globalThis, "fetch", async () =>
    Response.json(completedOutput(brief())),
  );

  const crossSite: Record<string, string>[] = [
    { "sec-fetch-site": "cross-site" },
    { "sec-fetch-site": "same-site" },
    { origin: "https://attacker.example" },
    { origin: "null" },
  ];
  for (const headers of crossSite) {
    const response = await POST(request({ headers }));
    assert.equal(response.status, 403);
    assert.match((await response.json()).error, /from this site/);
  }
  assert.equal(provider.mock.callCount(), 0);

  const ownSite: Record<string, string>[] = [
    { "sec-fetch-site": "same-origin" },
    { origin: "http://localhost" },
    { origin: "https://portfolio.example", host: "portfolio.example" },
    {},
  ];
  for (const headers of ownSite) {
    assert.equal((await POST(request({ headers }))).status, 200);
  }
  assert.equal(provider.mock.callCount(), ownSite.length);
});

test("stops generating once the daily budget is used and keeps raw addresses out of the store", async () => {
  process.env.UPSTASH_REDIS_REST_URL = upstashUrl;
  process.env.UPSTASH_REDIS_REST_TOKEN = "upstash-token-not-a-real-credential";
  process.env.UX_ARCHITECT_DAILY_LIMIT = "2";
  const services = mockUpstashAndOpenAI();

  assert.equal((await POST(request())).status, 200);
  assert.equal((await POST(request())).status, 200);
  const blocked = await POST(request());
  assert.equal(blocked.status, 503);
  assert.match((await blocked.json()).error, /have all been used/);
  assert.ok(Number(blocked.headers.get("Retry-After")) > 0);

  assert.equal(services.generations(), 2);
  assert.equal(services.counters.get("ux-architect:daily-budget"), 3);
  for (const key of services.counters.keys()) assert.doesNotMatch(key, /openai-route-test/);
});

test("limits each visitor without charging the shared budget for blocked requests", async () => {
  // Some Vercel and Upstash integrations inject these names instead.
  process.env.KV_REST_API_URL = upstashUrl;
  process.env.KV_REST_API_TOKEN = "kv-token-not-a-real-credential";
  process.env.UX_ARCHITECT_VISITOR_LIMIT = "2";
  const services = mockUpstashAndOpenAI();

  const ip = "openai-route-test-repeat-visitor";
  assert.equal((await POST(request({ ip }))).status, 200);
  assert.equal((await POST(request({ ip }))).status, 200);
  const blocked = await POST(request({ ip }));
  assert.equal(blocked.status, 429);
  assert.match((await blocked.json()).error, /today's free generations/);
  assert.ok(Number(blocked.headers.get("Retry-After")) > 0);

  assert.equal(services.generations(), 2);
  assert.equal(services.counters.get("ux-architect:daily-budget"), 2);
  assert.equal((await POST(request())).status, 200);
});

test("applies the same limits in memory when no shared store is configured", async () => {
  process.env.UX_ARCHITECT_VISITOR_LIMIT = "1";
  const provider = mock.method(globalThis, "fetch", async () =>
    Response.json(completedOutput(brief())),
  );

  const ip = "openai-route-test-memory-visitor";
  assert.equal((await POST(request({ ip }))).status, 200);
  assert.equal((await POST(request({ ip }))).status, 429);
  assert.equal(provider.mock.callCount(), 1);

  process.env.UX_ARCHITECT_DAILY_LIMIT = "0";
  const paused = await POST(request());
  assert.equal(paused.status, 503);
  assert.match((await paused.json()).error, /have all been used/);
  assert.equal(provider.mock.callCount(), 1);
});

test("fails closed instead of generating when the limit store can't be used", async () => {
  process.env.UPSTASH_REDIS_REST_URL = upstashUrl;
  process.env.UPSTASH_REDIS_REST_TOKEN = "upstash-token-not-a-real-credential";
  const services = mockUpstashAndOpenAI({ upstashStatus: 500 });

  const unreachable = await POST(request());
  assert.equal(unreachable.status, 503);
  assert.match((await unreachable.json()).error, /temporarily unavailable/);

  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  assert.equal((await POST(request())).status, 503);
  assert.equal(services.generations(), 0);
});

test("keeps a value pasted into the wrong limit setting out of the logs", async () => {
  const misplacedSecret = "sk-proj-misplaced-secret-not-a-real-credential";
  process.env.UPSTASH_REDIS_REST_URL = misplacedSecret;
  process.env.UPSTASH_REDIS_REST_TOKEN = "upstash-token-not-a-real-credential";
  const logged = mock.method(console, "error", () => {});
  const services = mockUpstashAndOpenAI();

  for (const url of [misplacedSecret, `redis://default:${misplacedSecret}@limits.example.upstash.io`]) {
    process.env.UPSTASH_REDIS_REST_URL = url;
    const response = await POST(request());
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /temporarily unavailable/);
  }

  const output = logged.mock.calls
    .flatMap((call) => call.arguments)
    .map((value) => (value instanceof Error ? `${value.message} ${String(value.cause)}` : String(value)))
    .join("\n");
  assert.match(output, /Upstash REST URL must be the https:\/\/ address/);
  assert.doesNotMatch(output, /misplaced-secret/);
  assert.equal(services.generations(), 0);
});

test("keeps the shared daily count when a flood of new visitors fills the in-memory store", async () => {
  process.env.UX_ARCHITECT_DAILY_LIMIT = "1000000";
  const before = (await consumeDailyBudget()).count;
  for (let index = 0; index < 5_100; index += 1) {
    await consumeVisitorLimit(`openai-route-test-flood-${index}`);
  }
  assert.equal((await consumeDailyBudget()).count, before + 1);
});

test("ignores a limit setting that isn't a whole number instead of removing the cap", async () => {
  process.env.UX_ARCHITECT_DAILY_LIMIT = "lots";
  process.env.UX_ARCHITECT_VISITOR_LIMIT = "-3";

  const budget = await consumeDailyBudget();
  const visitor = await consumeVisitorLimit("openai-route-test-bad-setting");
  for (const { limit } of [budget, visitor]) {
    assert.ok(Number.isSafeInteger(limit) && limit > 0);
  }
});

test("requires a JSON content type so a cross-origin form can't spend a generation", async () => {
  const provider = mock.method(globalThis, "fetch", async () =>
    Response.json(completedOutput(brief())),
  );

  for (const type of ["text/plain", "application/x-www-form-urlencoded", "application/jsonp"]) {
    const response = await POST(request({ headers: { "Content-Type": type } }));
    assert.equal(response.status, 415);
  }
  assert.equal(provider.mock.callCount(), 0);

  for (const type of ["application/json; charset=utf-8", "APPLICATION/JSON"]) {
    assert.equal((await POST(request({ headers: { "Content-Type": type } }))).status, 200);
  }
});

test("rejects an oversized body whether or not it declares a length, and stops reading it", async () => {
  const provider = mock.method(globalThis, "fetch", async () =>
    Response.json(completedOutput(brief())),
  );
  const headers = { "Content-Type": "application/json", "x-real-ip": "openai-route-test-body" };
  const post = (init: NextRequestInit) =>
    POST(new NextRequest("http://localhost/api/generate-ux", { method: "POST", headers, ...init }));

  assert.equal((await post({ body: "{}", headers: { ...headers, "content-length": "50000" } })).status, 413);
  assert.equal((await post({ body: JSON.stringify({ idea: "x".repeat(20_000) }) })).status, 413);
  assert.equal((await post({ body: "{not json" })).status, 400);

  // A chunked upload has no Content-Length to check, so the bytes received are what count.
  let pulls = 0;
  let cancelled = false;
  const chunk = new TextEncoder().encode(" ".repeat(1_000));
  const upload = new ReadableStream<Uint8Array>({
    pull(controller) {
      pulls += 1;
      if (pulls > 5_000) controller.close();
      else controller.enqueue(chunk);
    },
    cancel() {
      cancelled = true;
    },
  });
  const chunked = await post({ body: upload, duplex: "half" } as NextRequestInit);
  assert.equal(chunked.status, 413);
  assert.ok(cancelled && pulls < 50, `read ${pulls} chunks before giving up`);
  assert.equal(provider.mock.callCount(), 0);
});

test("keys IPv6 visitors by their /64 so rotating addresses can't reset the cap", async () => {
  const group = visitorGroup("2001:db8:abcd:12::1");
  assert.equal(group, "2001:0db8:abcd:0012::/64");
  assert.equal(visitorGroup("2001:DB8:ABCD:12:aaaa:bbbb:cccc:dddd"), group);
  assert.notEqual(visitorGroup("2001:db8:abcd:13::1"), group);
  assert.equal(visitorGroup("fe80::1%eth0"), visitorGroup("fe80::2"));
  assert.equal(visitorGroup("::ffff:203.0.113.9"), "203.0.113.9");
  assert.equal(visitorGroup("::ffff:cb00:7109"), "203.0.113.9");
  assert.equal(visitorGroup("203.0.113.9"), "203.0.113.9");
  assert.equal(visitorGroup("unknown"), "unknown");

  process.env.UX_ARCHITECT_VISITOR_LIMIT = "1";
  mock.method(globalThis, "fetch", async () => Response.json(completedOutput(brief())));
  assert.equal((await POST(request({ ip: "2001:db8:aa:1::1" }))).status, 200);
  assert.equal((await POST(request({ ip: "2001:db8:aa:1:1234:5678:9abc:def0" }))).status, 429);
  assert.equal((await POST(request({ ip: "2001:db8:aa:2::1" }))).status, 200);
});

test("keeps generation switched off on Vercel until shared limit storage is configured", async () => {
  process.env.VERCEL = "1";
  const services = mockUpstashAndOpenAI();

  const response = await POST(request());
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /temporarily unavailable/);
  assert.equal(services.generations(), 0);

  process.env.UPSTASH_REDIS_REST_URL = upstashUrl;
  process.env.UPSTASH_REDIS_REST_TOKEN = "upstash-token-not-a-real-credential";
  assert.equal((await POST(request())).status, 200);
  assert.equal(services.generations(), 1);
});

test("keeps generation switched off in production unless in-memory limits are chosen on purpose", async () => {
  setNodeEnv("production");
  const services = mockUpstashAndOpenAI();

  const response = await POST(request());
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /temporarily unavailable/);

  process.env.UX_ARCHITECT_ALLOW_MEMORY_STORE = "true";
  assert.equal((await POST(request())).status, 503);
  assert.equal(services.generations(), 0);

  // Serverless instances don't share memory, so the opt-in can't override the Vercel guard.
  process.env.UX_ARCHITECT_ALLOW_MEMORY_STORE = "1";
  process.env.VERCEL = "1";
  assert.equal((await POST(request())).status, 503);
  delete process.env.VERCEL;
  assert.equal(services.generations(), 0);

  process.env.UX_ARCHITECT_VISITOR_LIMIT = "1";
  const ip = "openai-route-test-production-memory";
  assert.equal((await POST(request({ ip }))).status, 200);
  assert.equal((await POST(request({ ip }))).status, 429);
  assert.equal(services.generations(), 1);

  delete process.env.UX_ARCHITECT_ALLOW_MEMORY_STORE;
  process.env.UPSTASH_REDIS_REST_URL = upstashUrl;
  process.env.UPSTASH_REDIS_REST_TOKEN = "upstash-token-not-a-real-credential";
  assert.equal((await POST(request())).status, 200);
  assert.equal(services.generations(), 2);
});

test("tags each OpenAI request with a per-visitor identifier that can't be reversed to an address", async () => {
  const provider = mock.method(globalThis, "fetch", async () =>
    Response.json(completedOutput(brief())),
  );
  async function identifierFor(ip: string) {
    assert.equal((await POST(request({ ip }))).status, 200);
    const options = provider.mock.calls.at(-1)?.arguments[1];
    return JSON.parse(String(options?.body)).safety_identifier as string;
  }

  const first = await identifierFor("2001:db8:aa:1::1");
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.equal(await identifierFor("2001:db8:aa:1:1234:5678:9abc:def0"), first);
  assert.notEqual(await identifierFor("2001:db8:aa:2::1"), first);

  const ipv4 = await identifierFor("203.0.113.9");
  assert.notEqual(ipv4, createHash("sha256").update("203.0.113.9").digest("hex"));
  process.env.OPENAI_API_KEY = "another-test-key-not-a-real-credential";
  assert.notEqual(await identifierFor("203.0.113.9"), ipv4);
});

test("only answers localhost on the dev server, which doesn't apply the usage caps", async () => {
  setNodeEnv("development");
  const provider = mock.method(globalThis, "fetch", async () =>
    Response.json(completedOutput(brief())),
  );

  for (const host of ["192.168.1.20:3000", "attacker.example:3000", "localhost.attacker.example"]) {
    const response = await POST(request({ headers: { host } }));
    assert.equal(response.status, 403);
    assert.match((await response.json()).error, /only accepts requests from localhost/);
  }
  assert.equal(provider.mock.callCount(), 0);

  for (const host of ["localhost:3000", "127.0.0.1:3000", "[::1]:3000", "LOCALHOST"]) {
    assert.equal((await POST(request({ headers: { host } }))).status, 200);
  }
});
