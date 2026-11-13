import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  buildUXSystemPrompt,
  buildUXUserPrompt,
  isUXPlatform,
  normalizeUXArchitecture,
  uxArchitectureSchema,
} from "@/lib/ux-architect";
import {
  consumeDailyBudget,
  consumeVisitorLimit,
  visitorGroup,
  type LimitResult,
} from "@/lib/ux-architect-limits";
import {
  isRecord,
  isUXArchitectureResponse,
  type UXPlatform,
} from "@/types/ux-architect";

export const runtime = "nodejs";
// The model reasons before it answers, so generation can outlast the default function duration.
export const maxDuration = 60;

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-5-mini";
// Reasoning tokens count toward max_output_tokens; OpenAI recommends reserving about 25K.
const MAX_OUTPUT_TOKENS = 25_000;
const PROVIDER_TIMEOUT_MS = 55_000;
// Billing problems also return 429, but retrying won't help until credits or limits change.
const BILLING_ERROR_CODES = new Set([
  "insufficient_quota",
  "credit_balance_exhausted",
  "organization_spend_limit_exceeded",
  "project_spend_limit_exceeded",
  "organization_usage_limit_exceeded",
]);

const MAX_BODY_BYTES = 12_000;
const MAX_IDEA_LENGTH = 500;
const JSON_CONTENT_TYPE = /^application\/json\s*(?:;|$)/i;
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

// `next dev` doesn't apply the usage caps, so it must only answer this machine. Binding it to
// 127.0.0.1 keeps other devices out; this also rejects a DNS-rebinding page that reaches
// localhost under its own hostname.
function isRemoteDevRequest(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "development") return false;

  const host = request.headers.get("host") ?? request.nextUrl.host;
  return !LOCAL_HOSTNAMES.has(host.replace(/:\d+$/, "").toLowerCase());
}

function getClientAddress(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 100);

  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedAddress = forwardedFor?.split(",").at(-1)?.trim();
  return forwardedAddress ? forwardedAddress.slice(0, 100) : "unknown";
}

// Lets OpenAI trace abusive prompts to one visitor instead of to this whole API key. Keying the hash
// with the API key keeps the visitor's address from being recovered by trying every IPv4 address.
function safetyIdentifier(address: string, apiKey: string): string {
  return createHmac("sha256", apiKey).update(visitorGroup(address)).digest("hex");
}

// Browsers cannot forge these headers. A cross-origin page can still send a "simple" POST without a
// CORS preflight, which would otherwise spend generations through its visitors' browsers.
function isCrossSiteRequest(request: NextRequest): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite !== "same-origin";

  // Older browsers send no fetch metadata, so fall back to comparing the Origin with this host.
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const ownHosts = new Set([
    request.nextUrl.host,
    request.headers.get("host"),
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),
  ]);
  try {
    return !ownHosts.has(new URL(origin).host);
  } catch {
    return true;
  }
}

// Returns null once the body passes the size limit. Content-Length can be missing or wrong, so
// the bytes actually received are what get counted.
async function readBody(request: NextRequest): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder();
  let text = "";
  let bytes = 0;
  for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
    bytes += chunk.value.byteLength;
    if (bytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(chunk.value, { stream: true });
  }
  return text + decoder.decode();
}

// A limiter that can't be reached must stop generation rather than let it run uncapped.
async function checkLimit(consume: () => Promise<LimitResult>): Promise<LimitResult | null> {
  try {
    return await consume();
  } catch (error) {
    console.error("UX Architect usage limiter failed:", error);
    return null;
  }
}

function limiterUnavailable() {
  return NextResponse.json(
    { error: "Generation is temporarily unavailable. Please try again." },
    { status: 503 },
  );
}

// Visitors only see a generic message, so the local dev server says which setting to fix instead.
function describeSetupProblem(
  failure: { status: number; code?: string; message?: string; billing: boolean },
  model: string,
): string | undefined {
  if (process.env.NODE_ENV !== "development") return undefined;

  if (failure.status === 401) {
    return 'OpenAI rejected OPENAI_API_KEY. Paste a secret key that starts with "sk-" into .env.local, then restart the dev server.';
  }
  if (failure.code === "model_not_found") {
    return `OpenAI can't use the model "${model}". Set OPENAI_MODEL in .env.local to a model your account can access, then restart the dev server.`;
  }
  if (failure.billing) {
    return `OpenAI reports a billing problem (${failure.code}). Check the credit balance and spend limits in your OpenAI account.`;
  }
  return `OpenAI returned ${failure.status}${failure.code ? ` ${failure.code}` : ""}: ${failure.message ?? "no details"}`;
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

// Reasoning items come before the message item, whose content holds the JSON or a refusal.
function getResponseOutput(payload: Record<string, unknown>): { text: string; refused: boolean } {
  let text = "";
  let refused = false;
  if (!Array.isArray(payload.output)) return { text, refused };

  for (const item of payload.output) {
    if (!isRecord(item) || item.type !== "message" || !Array.isArray(item.content)) continue;
    for (const part of item.content) {
      if (!isRecord(part)) continue;
      if (part.type === "refusal") refused = true;
      if (part.type === "output_text" && typeof part.text === "string") text += part.text;
    }
  }
  return { text, refused };
}

// Counts show which section failed validation without logging generated content.
function describeBriefShape(value: unknown) {
  if (!isRecord(value)) return typeof value;
  const count = (list: unknown) => (Array.isArray(list) ? list.length : null);
  return {
    personas: count(value.personas),
    journeyStages: count(value.journey),
    blocksPerScreen: Array.isArray(value.wireframes)
      ? value.wireframes.map((screen) => (isRecord(screen) ? count(screen.blocks) : null))
      : null,
  };
}

export async function POST(request: NextRequest) {
  if (isRemoteDevRequest(request)) {
    return NextResponse.json(
      { error: "The development server only accepts requests from localhost." },
      { status: 403 },
    );
  }
  if (isCrossSiteRequest(request)) {
    return NextResponse.json({ error: "Requests must come from this site." }, { status: 403 });
  }

  // A cross-origin page can only send JSON after a CORS preflight, which this route never allows.
  if (!JSON_CONTENT_TYPE.test(request.headers.get("content-type") ?? "")) {
    return NextResponse.json({ error: "Request must be JSON." }, { status: 415 });
  }

  let body: unknown;
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    const text = contentLength > MAX_BODY_BYTES ? null : await readBody(request);
    if (text === null) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Request must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("idea" in body) ||
    !("platform" in body) ||
    typeof body.idea !== "string" ||
    body.idea.trim().length < 10 ||
    body.idea.trim().length > MAX_IDEA_LENGTH ||
    !isUXPlatform(body.platform)
  ) {
    return NextResponse.json(
      { error: "Enter a product idea of 10–500 characters and choose a supported platform." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI generation isn't configured yet. You can still explore the sample brief." },
      { status: 503 },
    );
  }
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;

  // Only requests that would reach OpenAI count, so invalid input and a missing key use no quota.
  const clientAddress = getClientAddress(request);
  const visitor = await checkLimit(() => consumeVisitorLimit(clientAddress));
  if (!visitor) return limiterUnavailable();
  if (!visitor.allowed) {
    return NextResponse.json(
      {
        error:
          "You've used today's free generations. Please come back tomorrow, or explore the sample brief.",
      },
      { status: 429, headers: { "Retry-After": String(visitor.retryAfterSeconds) } },
    );
  }

  // The visitor check runs first so blocked visitors can't drain the budget shared by everyone.
  const budget = await checkLimit(consumeDailyBudget);
  if (!budget) return limiterUnavailable();
  if (!budget.allowed) {
    // Log once per window rather than on every blocked request.
    if (budget.count === budget.limit + 1) {
      console.warn("UX Architect: the daily generation limit was reached.", {
        limit: budget.limit,
      });
    }
    return NextResponse.json(
      {
        error:
          "Today's free AI generations have all been used. Please come back tomorrow, or explore the sample brief.",
      },
      { status: 503, headers: { "Retry-After": String(budget.retryAfterSeconds) } },
    );
  }

  let providerResponse: Response;
  let providerPayload: unknown;
  try {
    providerResponse = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: buildUXSystemPrompt(body.platform as UXPlatform),
        input: buildUXUserPrompt(body.idea.trim()),
        max_output_tokens: MAX_OUTPUT_TOKENS,
        reasoning: { effort: "medium" },
        // Each brief is returned once and never retrieved later, so don't keep it as application state.
        store: false,
        safety_identifier: safetyIdentifier(clientAddress, apiKey),
        text: {
          format: {
            type: "json_schema",
            name: "ux_architecture",
            strict: true,
            schema: uxArchitectureSchema,
          },
        },
      }),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
    providerPayload = parseJson(await providerResponse.text());
  } catch (error) {
    const timedOut =
      error instanceof DOMException && error.name === "TimeoutError";
    console.error("UX Architect: OpenAI API request failed:", error);
    return NextResponse.json(
      {
        error: timedOut
          ? "Generation took too long. Please try again."
          : "The AI service is temporarily unreachable. Please try again.",
      },
      { status: timedOut ? 504 : 502 },
    );
  }

  const requestId = providerResponse.headers.get("x-request-id");
  if (!providerResponse.ok) {
    const providerError =
      isRecord(providerPayload) && isRecord(providerPayload.error) ? providerPayload.error : {};
    const errorType = typeof providerError.type === "string" ? providerError.type : undefined;
    const errorCode = typeof providerError.code === "string" ? providerError.code : undefined;
    const errorMessage =
      typeof providerError.message === "string" ? providerError.message.slice(0, 300) : undefined;
    console.error("UX Architect: OpenAI API returned an error.", {
      status: providerResponse.status,
      type: errorType,
      code: errorCode,
      message: errorMessage,
      model,
      requestId,
    });
    const billing =
      BILLING_ERROR_CODES.has(errorType ?? "") || BILLING_ERROR_CODES.has(errorCode ?? "");
    // A rejected key or an unusable model fails every request until the setup changes.
    const unavailable =
      billing ||
      providerResponse.status === 401 ||
      providerResponse.status === 403 ||
      errorCode === "model_not_found";
    const busy =
      !unavailable && (providerResponse.status === 429 || providerResponse.status >= 500);
    const setupProblem = describeSetupProblem(
      {
        status: providerResponse.status,
        code: errorCode ?? errorType,
        message: errorMessage,
        billing,
      },
      model,
    );
    return NextResponse.json(
      {
        error:
          setupProblem ??
          (unavailable
            ? "AI generation is temporarily unavailable. You can still explore the sample brief."
            : busy
              ? "The AI service is busy right now. Please try again in a minute."
              : "The AI service couldn't generate a brief right now. Please try again."),
      },
      { status: unavailable || busy ? 503 : 502 },
    );
  }

  if (!isRecord(providerPayload)) {
    console.error("UX Architect: OpenAI API returned an unreadable response.", { model, requestId });
    return NextResponse.json(
      { error: "The AI service returned an unreadable response. Please try again." },
      { status: 502 },
    );
  }

  const status = providerPayload.status;
  const incompleteReason = isRecord(providerPayload.incomplete_details)
    ? providerPayload.incomplete_details.reason
    : undefined;
  const output = getResponseOutput(providerPayload);
  if (output.refused || incompleteReason === "content_filter") {
    console.warn("UX Architect: OpenAI declined to generate a brief.", {
      model,
      requestId,
      incompleteReason,
    });
    return NextResponse.json(
      { error: "This idea couldn't be turned into a brief. Try rephrasing it." },
      { status: 422 },
    );
  }
  if (incompleteReason === "max_output_tokens") {
    console.error("UX Architect: OpenAI reached the output token limit.", { model, requestId });
    return NextResponse.json(
      { error: "The brief was cut off before it finished. Please try again." },
      { status: 502 },
    );
  }
  if (status !== "completed") {
    console.error("UX Architect: OpenAI response didn't complete.", {
      model,
      requestId,
      status,
      incompleteReason,
    });
    return NextResponse.json(
      { error: "The AI service couldn't generate a brief right now. Please try again." },
      { status: 502 },
    );
  }

  const result = normalizeUXArchitecture(parseJson(output.text));
  if (!isUXArchitectureResponse(result)) {
    console.error("UX Architect: OpenAI's brief failed validation.", {
      model,
      requestId,
      shape: describeBriefShape(result),
    });
    return NextResponse.json(
      { error: "The AI service returned an incomplete brief. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ result });
}
