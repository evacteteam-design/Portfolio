"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  FileDown,
  FlaskConical,
  LayoutTemplate,
  Lightbulb,
  Mic,
  Route,
  Square,
  Users,
} from "lucide-react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  SelectField,
  Tabs,
  TextArea,
  Toast,
} from "@akhil-vanga/design-system";
import { BriefLoadingScene } from "@/components/BriefLoadingScene";
import { TurnstileChallenge } from "@/components/TurnstileChallenge";
import { useSpeechDictation } from "@/hooks/useSpeechDictation";
import {
  UX_PLATFORMS,
  type JourneyStage,
  type QuickAnswer,
  type UXArchitectureResponse,
  type UXPlatform,
  type UserPersona,
  type WireframeBlock,
  type WireframeBlockType,
  type WireframeScreen,
  isUXArchitectureResponse,
} from "@/types/ux-architect";

interface BriefState {
  data: UXArchitectureResponse;
  platform: UXPlatform;
  source: "sample" | "generated";
}

// Gutters match the fixed navbar so the full-width layout lines up with it.
const pageFrame = "mx-auto w-full max-w-[160rem] px-4 sm:px-6 md:px-14";
const eyebrow = "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--av-color-muted)]";
const formatStep = (index: number) => String(index + 1).padStart(2, "0");
const IDEA_MIN_LENGTH = 10;
const IDEA_MAX_LENGTH = 500;

const deliverables = [
  {
    title: "Quick answer",
    detail: "A straight reply to your question or problem, plus three steps to take now.",
  },
  {
    title: "User personas",
    detail: "Three audience hypotheses with goals, frustrations, and behaviors.",
  },
  {
    title: "Journey map",
    detail: "Five stages from first need to repeat use, with friction and opportunities.",
  },
  {
    title: "Wireframe blueprint",
    detail: "Three annotated key screens framed for the target platform.",
  },
];

// Tiles for the empty state. The outer two lean in so the trio reads as a fanned stack.
const previewTiles = [
  {
    label: "Personas",
    Icon: Users,
    tint: "bg-[color-mix(in_srgb,var(--av-color-brand)_12%,white)] text-[var(--av-color-brand-hover)]",
    pose: "rotate-[-8deg] translate-y-2 -mr-1",
  },
  {
    label: "Journey",
    Icon: Route,
    tint: "bg-[#eaf7f0] text-[var(--av-color-success)]",
    pose: "z-10 -translate-y-1",
  },
  {
    label: "Wireframes",
    Icon: LayoutTemplate,
    tint: "bg-[#fff5df] text-[var(--av-color-warning)]",
    pose: "rotate-[8deg] translate-y-2 -ml-1",
  },
];

const presets = [
  {
    label: "Beat procrastination",
    idea: "I keep putting off big projects until the last minute. How can I stay focused and actually finish them?",
  },
  {
    label: "Dog-walking marketplace",
    idea: "A neighborhood app that helps busy dog owners find trusted, last-minute walkers nearby.",
  },
  {
    label: "Flight disruption assistant",
    idea: "A travel assistant that helps airline passengers recover quickly when a flight is delayed or canceled.",
  },
  {
    label: "Freelance invoice tracker",
    idea: "A simple workspace for independent freelancers to track invoices, follow up on late payments, and forecast cash flow.",
  },
];

const sampleBrief: UXArchitectureResponse = {
  quickAnswer: {
    answer:
      "There's real demand when owners need last-minute care, but trust is the riskiest assumption. Prove owners will hand a nearby stranger their keys before investing in scheduling features.",
    steps: [
      {
        title: "Interview ten dog owners",
        detail: "Ask how they found their last walker and what nearly stopped them from booking.",
      },
      {
        title: "Run a manual pilot",
        detail: "Match a few owners and walkers by text for two weeks to see who books again.",
      },
      {
        title: "Test trust signals",
        detail: "Compare which profile details, such as reviews, ID checks, or intro videos, make owners say yes.",
      },
    ],
  },
  projectTitle: "Neighborhood dog-walking marketplace",
  valueProposition:
    "Help dog owners confidently find and coordinate trusted neighborhood care.",
  researchNote:
    "Sample preview only. These AI-style personas and journey assumptions are illustrative and need validation with real users.",
  personas: [
    {
      archetype: "The time-pressed commuter",
      context: "A dog owner whose return time changes with work and travel.",
      primaryGoal: "Arrange reliable care without disrupting a busy day.",
      coreFrustration: "Availability and response times are hard to compare quickly.",
      keyBehavior: "Checks schedule, distance, and confirmation before booking.",
      techComfort: "Comfortable with mobile booking and messaging.",
    },
    {
      archetype: "The cautious first-time owner",
      context: "A newer dog owner who wants reassurance before sharing access.",
      primaryGoal: "Find a capable walker they can trust with their dog.",
      coreFrustration: "Profiles do not always make experience and expectations clear.",
      keyBehavior: "Reads reviews and asks questions before committing.",
      techComfort: "Uses common apps but values clear guidance.",
    },
    {
      archetype: "The flexible neighborhood walker",
      context: "A local walker balancing multiple requests throughout the week.",
      primaryGoal: "Manage availability and accept suitable walks efficiently.",
      coreFrustration: "Schedule changes and incomplete pet details create extra coordination.",
      keyBehavior: "Reviews location, timing, and care notes before accepting.",
      techComfort: "Comfortable managing work from a phone.",
    },
  ],
  journey: [
    {
      stageName: "Need emerges",
      userAction: "Realizes their usual care plan will not cover an upcoming day.",
      emotionalState: "Concerned",
      friction: "The need may be urgent and the schedule uncertain.",
      uxOpportunity: "Make the next available care options easy to scan.",
    },
    {
      stageName: "Explore nearby care",
      userAction: "Checks walkers by availability, distance, and experience.",
      emotionalState: "Hopeful, but cautious",
      friction: "Profiles can make qualifications and fit difficult to compare.",
      uxOpportunity: "Show consistent profile details and trust signals.",
    },
    {
      stageName: "Choose a walker",
      userAction: "Reviews a profile and sends a booking request with care notes.",
      emotionalState: "Careful",
      friction: "The owner may not know whether the walker understood key needs.",
      uxOpportunity: "Summarize schedule and pet instructions before sending.",
    },
    {
      stageName: "Coordinate the walk",
      userAction: "Confirms details and follows progress after the request is accepted.",
      emotionalState: "Reassured, if informed",
      friction: "Last-minute changes can be hard to communicate.",
      uxOpportunity: "Keep updates and a clear contact path in one place.",
    },
    {
      stageName: "Review and repeat",
      userAction: "Shares feedback and decides whether to book again.",
      emotionalState: "Satisfied or uncertain",
      friction: "Useful care preferences can be lost between bookings.",
      uxOpportunity: "Make feedback and repeat booking straightforward.",
    },
  ],
  wireframes: [
    {
      screenName: "Discover care",
      purpose: "Find available walkers who match a location and time.",
      blocks: [
        { type: "header", label: "Neighborhood + profile", annotation: "Location and account access." },
        { type: "search", label: "When and where", annotation: "Set a time window and nearby area." },
        { type: "map", label: "Walkers nearby", annotation: "See who is close enough for a last-minute walk." },
        { type: "card-grid", label: "Available walkers", annotation: "Compare experience, distance, and ratings." },
        { type: "tabs", label: "Bottom navigation", annotation: "Jump between home, bookings, messages, and profile." },
      ],
    },
    {
      screenName: "Walker profile",
      purpose: "Understand fit and request a walk with clear care details.",
      blocks: [
        { type: "header", label: "Walker summary", annotation: "Name, location, and availability." },
        { type: "media", label: "Intro photo and video", annotation: "Help owners recognize the walker before sharing access." },
        { type: "hero", label: "Experience and approach", annotation: "Introduce care style and qualifications." },
        { type: "list", label: "Reviews and details", annotation: "Surface relevant trust information." },
        { type: "cta", label: "Request a walk", annotation: "Continue with the selected time." },
      ],
    },
    {
      screenName: "Confirm request",
      purpose: "Review the booking details and share important pet instructions.",
      blocks: [
        { type: "header", label: "Request details", annotation: "Keep the selected walker visible." },
        { type: "calendar", label: "Date and time", annotation: "Pick a walk slot that fits a changing schedule." },
        { type: "list", label: "Dog and address", annotation: "Review who is being walked and where." },
        { type: "form", label: "Care notes", annotation: "Add instructions and contact preferences." },
        { type: "cta", label: "Send request", annotation: "Confirm before notifying the walker." },
      ],
    },
  ],
};

function PersonaCard({ persona, index }: { persona: UserPersona; index: number }) {
  // Skip leading articles so "The busy commuter" becomes "BC", not "TB".
  const initialsSource = persona.archetype.replace(/^(the|a|an)\s+/i, "") || persona.archetype;

  return (
    <Card className="@container/persona h-full">
      <div className="grid h-full grid-cols-1 content-start gap-4 p-4 wrap-anywhere @sm/persona:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="shrink-0" aria-hidden="true">
            <Avatar name={initialsSource} />
          </span>
          <div className="min-w-0">
            <p className={`mb-1 ${eyebrow}`}>Persona {formatStep(index)}</p>
            <h3 className="text-lg font-semibold leading-snug text-[var(--av-color-ink)]">
              {persona.archetype}
            </h3>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[var(--av-color-muted)]">
          {persona.context}
        </p>
        <dl className="grid grid-cols-1 gap-x-5 gap-y-3 @lg/persona:grid-cols-2">
          <PersonaDetail label="Primary goal" value={persona.primaryGoal} />
          <PersonaDetail label="Core frustration" value={persona.coreFrustration} />
          <PersonaDetail label="Key behavior" value={persona.keyBehavior} />
          <PersonaDetail label="Tech comfort" value={persona.techComfort} />
        </dl>
      </div>
    </Card>
  );
}

function PersonaDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-t border-[var(--av-color-border)] pt-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--av-color-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-relaxed text-[var(--av-color-ink)]">{value}</dd>
    </div>
  );
}

function JourneyMap({ stages }: { stages: JourneyStage[] }) {
  return (
    <ol className="grid grid-cols-1 @6xl/brief:grid-cols-5 @6xl/brief:gap-x-4">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;

        return (
          <li
            key={`${stage.stageName}-${index}`}
            className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 @6xl/brief:row-span-5 @6xl/brief:grid-cols-1 @6xl/brief:grid-rows-subgrid"
          >
            <div className="flex flex-col items-center @6xl/brief:flex-row @6xl/brief:pb-3" aria-hidden="true">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--av-color-brand)] text-xs font-bold text-white">
                {formatStep(index)}
              </span>
              {!isLast && (
                <span className="my-1 w-px flex-1 bg-[var(--av-color-border)] @6xl/brief:my-0 @6xl/brief:-mr-2 @6xl/brief:ml-2 @6xl/brief:h-px @6xl/brief:w-auto" />
              )}
            </div>
            {/* Stages share subgrid rows on wide layouts so each detail row lines up across the map. */}
            <Card
              className={`grid min-w-0 grid-cols-1 gap-3 p-4 wrap-anywhere @2xl/brief:grid-cols-3 @2xl/brief:gap-x-5 @6xl/brief:row-span-4 @6xl/brief:mb-0 @6xl/brief:grid-cols-1 @6xl/brief:grid-rows-subgrid ${isLast ? "" : "mb-4"}`}
            >
              <div className="min-w-0 @2xl/brief:col-span-3 @6xl/brief:col-span-1">
                <h3 className="font-semibold leading-snug text-[var(--av-color-ink)]">
                  {stage.stageName}
                </h3>
                <p className="mt-2 w-fit max-w-full rounded-md bg-[var(--av-color-brand)]/10 px-2 py-1 text-xs leading-snug text-[var(--av-color-brand-hover)]">
                  <span className="font-semibold">Feeling · </span>
                  {stage.emotionalState}
                </p>
              </div>
              <JourneyDetail label="Action" value={stage.userAction} />
              <JourneyDetail label="Friction" value={stage.friction} />
              <JourneyDetail label="Opportunity" value={stage.uxOpportunity} />
            </Card>
          </li>
        );
      })}
    </ol>
  );
}

function JourneyDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-t border-[var(--av-color-border)] pt-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--av-color-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--av-color-ink)]">{value}</p>
    </div>
  );
}

const blockKinds: Record<WireframeBlockType, string> = {
  header: "Header",
  hero: "Hero",
  search: "Search",
  metric: "Metric",
  "card-grid": "Card grid",
  list: "List",
  form: "Form",
  chart: "Chart",
  cta: "Action",
  tabs: "Tabs",
  map: "Map",
  media: "Media",
  chat: "Chat",
  calendar: "Calendar",
};

// In desktop frames wide enough for two columns, these blocks still span the full row.
const fullWidthBlocks: ReadonlySet<WireframeBlockType> = new Set([
  "header",
  "tabs",
  "hero",
  "search",
  "media",
  "card-grid",
  "cta",
]);

const mapPins = [
  { left: "24%", top: "36%" },
  { left: "55%", top: "64%" },
  { left: "78%", top: "28%" },
];

// Half-width blocks pair up in two-column frames; one left without a partner takes the full row.
function getFullRowFlags(blocks: WireframeBlock[]): boolean[] {
  const isFullWidth = blocks.map((block) => fullWidthBlocks.has(block.type));
  let awaitingPartner = false;
  return isFullWidth.map((full, index) => {
    if (full) {
      awaitingPartner = false;
      return true;
    }
    awaitingPartner = !awaitingPartner;
    const nextIsHalfWidth = index + 1 < blocks.length && !isFullWidth[index + 1];
    return awaitingPartner && !nextIsHalfWidth;
  });
}

function WireframeShape({ type }: { type: WireframeBlockType }) {
  const line = "h-1.5 rounded bg-[var(--av-color-border)]";
  const shortLine = "h-1.5 w-2/3 rounded bg-[var(--av-color-border)]";
  const heading = "h-2.5 rounded bg-[var(--av-color-muted)] opacity-40";
  const placeholder = "rounded-md border border-[var(--av-color-border)] bg-[var(--av-color-surface)]";

  if (type === "tabs") {
    return (
      <div className={`grid grid-cols-4 gap-1 p-1 ${placeholder}`}>
        {[0, 1, 2, 3].map((item) => (
          <span
            key={item}
            className={`grid h-6 place-items-center rounded ${
              item === 0 ? "bg-[var(--av-color-canvas)] shadow-sm" : ""
            }`}
          >
            <span
              className={`h-1.5 w-3/5 rounded ${
                item === 0 ? "bg-[var(--av-color-brand)] opacity-70" : "bg-[var(--av-color-border)]"
              }`}
            />
          </span>
        ))}
      </div>
    );
  }
  if (type === "map") {
    return (
      <div
        className={`relative h-20 overflow-hidden ${placeholder}`}
        style={{
          backgroundImage:
            "linear-gradient(var(--av-color-border) 1px, transparent 1px), linear-gradient(90deg, var(--av-color-border) 1px, transparent 1px)",
          backgroundSize: "1rem 1rem",
        }}
      >
        {mapPins.map((pin, item) => (
          <span
            key={item}
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--av-color-canvas)] bg-[var(--av-color-brand)]"
            style={pin}
          />
        ))}
      </div>
    );
  }
  if (type === "media") {
    return (
      <div className={`relative h-20 overflow-hidden ${placeholder}`}>
        <svg
          className="absolute inset-0 h-full w-full text-[var(--av-color-border)]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 0L100 100M100 0L0 100"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="absolute inset-x-0 bottom-1.5 flex justify-center gap-1">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`h-1.5 w-1.5 rounded-full ${
                dot === 0 ? "bg-[var(--av-color-brand)] opacity-70" : "bg-[var(--av-color-border)]"
              }`}
            />
          ))}
        </span>
      </div>
    );
  }
  if (type === "chat") {
    const incoming = "h-4 rounded-lg rounded-bl-sm bg-[var(--av-color-border)] opacity-60";
    return (
      <div className="grid gap-1.5">
        <span className={`w-3/4 ${incoming}`} />
        <span className="h-4 w-3/5 justify-self-end rounded-lg rounded-br-sm bg-[var(--av-color-brand)] opacity-50" />
        <span className={`w-1/2 ${incoming}`} />
        <div className="mt-0.5 flex h-7 items-center gap-2 rounded-full border border-[var(--av-color-border)] px-2.5">
          <span className={`flex-1 ${line}`} />
          <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-[var(--av-color-brand)] opacity-70" />
        </div>
      </div>
    );
  }
  if (type === "calendar") {
    return (
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <span className={`w-1/3 ${heading}`} />
          <span className="flex gap-1">
            <span className="h-3 w-3 rounded-full bg-[var(--av-color-border)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--av-color-border)]" />
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 14 }, (_, day) => (
            <span
              key={day}
              className={`h-4 rounded-sm ${
                day === 9
                  ? "bg-[var(--av-color-brand)] opacity-70"
                  : "bg-[var(--av-color-border)] opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }
  if (type === "search") {
    return (
      <div className="flex h-8 items-center gap-2 rounded-md border border-[var(--av-color-border)] bg-[var(--av-color-surface)] px-2">
        <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[var(--av-color-border)]" />
        <span className="h-1.5 w-1/2 rounded bg-[var(--av-color-border)]" />
      </div>
    );
  }
  if (type === "cta") {
    return <div className="h-8 w-full rounded-md bg-[var(--av-color-brand)] opacity-70 @md/frame:w-2/5" />;
  }
  if (type === "card-grid" || type === "metric") {
    // Narrow frames show two items; wider frames reveal the third.
    return (
      <div className="grid grid-cols-2 gap-1.5 @sm/frame:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className={`gap-1.5 rounded-md p-1.5 ${item === 2 ? "hidden @sm/frame:grid" : "grid"} ${
              type === "metric"
                ? "bg-[var(--av-color-surface)]"
                : "border border-[var(--av-color-border)]"
            }`}
          >
            {type === "metric" ? (
              <>
                <span className="h-3 w-1/2 rounded bg-[var(--av-color-brand)] opacity-50" />
                <span className="h-1.5 w-3/4 rounded bg-[var(--av-color-border)]" />
              </>
            ) : (
              <>
                <span className="h-8 rounded bg-[var(--av-color-border)] opacity-60" />
                <span className={line} />
                <span className={shortLine} />
              </>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (type === "list") {
    return (
      <div className="grid gap-1.5">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 border-b border-[var(--av-color-border)] pb-1.5 last:border-b-0 last:pb-0"
          >
            <span className="h-6 w-6 shrink-0 rounded-full bg-[var(--av-color-border)] opacity-60" />
            <span className="grid flex-1 gap-1">
              <span className={line} />
              <span className={shortLine} />
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (type === "form") {
    return (
      <div className="grid gap-2">
        {[0, 1].map((item) => (
          <div key={item} className="grid gap-1">
            <span className="h-1.5 w-1/3 rounded bg-[var(--av-color-border)]" />
            <span className="h-7 rounded-md border border-[var(--av-color-border)] bg-[var(--av-color-surface)]" />
          </div>
        ))}
      </div>
    );
  }
  if (type === "chart") {
    return (
      <div className="flex h-16 items-end gap-1.5 rounded-md bg-[var(--av-color-surface)] p-2">
        {[35, 70, 50, 90, 60].map((height, item) => (
          <span
            key={item}
            className="flex-1 rounded-t bg-[var(--av-color-brand)] opacity-50"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    );
  }
  if (type === "hero") {
    return (
      <div className="grid gap-1.5 rounded-md bg-[var(--av-color-surface)] p-2.5">
        <span className={`w-2/3 ${heading}`} />
        <span className={line} />
        <span className="h-1.5 w-4/5 rounded bg-[var(--av-color-border)]" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`w-1/3 ${heading}`} />
      <span className="flex gap-1.5">
        <span className="h-4 w-4 rounded-full bg-[var(--av-color-border)]" />
        <span className="h-4 w-4 rounded-full bg-[var(--av-color-border)]" />
      </span>
    </div>
  );
}

function BlockNumber({ number, compact = false }: { number: number; compact?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-[var(--av-color-brand)] font-bold leading-none text-white ${
        compact ? "h-4 w-4 text-[0.5625rem]" : "h-6 w-6 text-[0.6875rem]"
      }`}
      aria-hidden="true"
    >
      {number}
    </span>
  );
}

function WireframeBlockPreview({
  block,
  number,
  spanFullRow,
}: {
  block: WireframeBlock;
  number: number;
  spanFullRow: boolean;
}) {
  return (
    <div
      className={`grid min-w-0 content-start gap-1.5 rounded-lg border border-dashed border-[var(--av-color-border)] p-2 ${
        spanFullRow ? "@md/frame:col-span-2" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <BlockNumber number={number} compact />
        <span className="truncate text-[0.6875rem] font-semibold text-[var(--av-color-ink)]">
          {block.label}
        </span>
      </div>
      <WireframeShape type={block.type} />
    </div>
  );
}

function DeviceFrame({
  platform,
  label,
  children,
}: {
  platform: UXPlatform;
  label: string;
  children: ReactNode;
}) {
  if (platform === "Mobile app") {
    return (
      <div
        role="img"
        aria-label={label}
        className="mx-auto w-full max-w-[18rem] rounded-[2rem] bg-[var(--av-color-ink)] p-1.5 shadow-[0_18px_40px_rgb(15_35_55/18%)]"
      >
        <div className="@container/frame overflow-hidden rounded-[1.625rem] bg-[var(--av-color-canvas)]">
          <div className="flex items-center justify-between px-5 pb-1 pt-2.5">
            <span className="text-[0.625rem] font-semibold text-[var(--av-color-ink)]">9:41</span>
            <span className="h-4 w-16 rounded-full bg-[var(--av-color-ink)]" />
            <span className="h-2 w-5 rounded-sm border border-[var(--av-color-ink)]" />
          </div>
          <div className="grid grid-cols-1 gap-2 p-2.5">{children}</div>
          <div className="flex justify-center pb-2 pt-1">
            <span className="h-1 w-20 rounded-full bg-[var(--av-color-ink)] opacity-70" />
          </div>
        </div>
      </div>
    );
  }

  const isDashboard = platform === "Enterprise dashboard";

  return (
    <div
      role="img"
      aria-label={label}
      className="w-full overflow-hidden rounded-xl border border-[var(--av-color-border)] bg-[var(--av-color-canvas)] shadow-[0_12px_32px_rgb(15_35_55/10%)]"
    >
      <div className="flex items-center gap-2 border-b border-[var(--av-color-border)] bg-[var(--av-color-surface)] px-3 py-2">
        <span className="flex shrink-0 gap-1">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-2 w-2 rounded-full bg-[var(--av-color-border)]" />
          ))}
        </span>
        <span className="h-4 flex-1 rounded-full bg-[var(--av-color-canvas)]" />
      </div>
      <div className={isDashboard ? "grid grid-cols-[2.25rem_minmax(0,1fr)]" : "grid grid-cols-1"}>
        {isDashboard && (
          <div className="grid content-start justify-items-center gap-2 border-r border-[var(--av-color-border)] bg-[var(--av-color-surface)] py-3">
            {[0, 1, 2, 3].map((item) => (
              <span
                key={item}
                className={`h-4 w-4 rounded ${
                  item === 0
                    ? "bg-[var(--av-color-brand)] opacity-70"
                    : "bg-[var(--av-color-border)]"
                }`}
              />
            ))}
          </div>
        )}
        <div className="@container/frame min-w-0 p-3">
          <div className="grid grid-cols-1 gap-2 @md/frame:grid-cols-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

function WireframeCard({
  screen,
  index,
  platform,
}: {
  screen: WireframeScreen;
  index: number;
  platform: UXPlatform;
}) {
  const isMobile = platform === "Mobile app";
  const fullRow = getFullRowFlags(screen.blocks);

  return (
    <Card className="@container/screen h-full">
      <div className="grid h-full grid-cols-1 content-start gap-5 p-4 wrap-anywhere @sm/screen:p-5">
        <div className="min-w-0">
          <p className={`mb-1 ${eyebrow}`}>Screen {formatStep(index)}</p>
          <h3 className="text-lg font-semibold leading-snug text-[var(--av-color-ink)]">
            {screen.screenName}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--av-color-muted)]">
            {screen.purpose}
          </p>
        </div>
        <div
          className={`grid grid-cols-1 items-start gap-5 ${
            isMobile
              ? "@lg/screen:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
              : "@2xl/screen:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
          }`}
        >
          <DeviceFrame platform={platform} label={`${screen.screenName} wireframe preview`}>
            {screen.blocks.map((block, blockIndex) => (
              <WireframeBlockPreview
                key={`${block.type}-${blockIndex}`}
                block={block}
                number={blockIndex + 1}
                spanFullRow={!isMobile && fullRow[blockIndex]}
              />
            ))}
          </DeviceFrame>
          <ol className="grid gap-3" aria-label={`${screen.screenName} annotations`}>
            {screen.blocks.map((block, blockIndex) => (
              <li
                key={`${block.type}-${blockIndex}`}
                className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-2.5"
              >
                <BlockNumber number={blockIndex + 1} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-semibold text-[var(--av-color-ink)]">{block.label}</p>
                    <Badge>{blockKinds[block.type]}</Badge>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--av-color-muted)]">
                    {block.annotation}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
}

function WireframeGallery({
  screens,
  platform,
}: {
  screens: WireframeScreen[];
  platform: UXPlatform;
}) {
  // Phones fit three-up sooner than browser frames, which need more width to read as desktop layouts.
  const columns =
    platform === "Mobile app" ? "@4xl/brief:grid-cols-3" : "@6xl/brief:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-5 ${columns}`}>
      {screens.map((screen, index) => (
        <WireframeCard
          key={`${screen.screenName}-${index}`}
          screen={screen}
          index={index}
          platform={platform}
        />
      ))}
    </div>
  );
}

function QuickAnswerCard({ quickAnswer }: { quickAnswer: QuickAnswer }) {
  return (
    <Card>
      <section aria-labelledby="quick-answer-title" className="grid gap-4 p-5 wrap-break-word @3xl/brief:p-6">
        <div className="flex items-center gap-2.5">
          <span
            className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fff5df] text-[var(--av-color-warning)]"
            aria-hidden="true"
          >
            <Lightbulb className="size-4" strokeWidth={2} />
          </span>
          <h2 id="quick-answer-title" className="text-lg font-semibold text-[var(--av-color-ink)]">
            Quick answer
          </h2>
        </div>
        <p className="max-w-4xl leading-relaxed text-[var(--av-color-ink)]">{quickAnswer.answer}</p>
        <ol className="grid grid-cols-1 gap-3 @3xl/brief:grid-cols-3" aria-label="Steps to take now">
          {quickAnswer.steps.map((step, index) => (
            <li
              key={`${step.title}-${index}`}
              className="grid min-w-0 content-start gap-1.5 rounded-xl border border-[var(--av-color-border)] bg-[var(--av-color-surface)] p-4"
            >
              <span className={eyebrow}>Step {formatStep(index)}</span>
              <p className="font-semibold leading-snug text-[var(--av-color-ink)]">{step.title}</p>
              <p className="text-sm leading-relaxed text-[var(--av-color-muted)]">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </Card>
  );
}

function toMarkdown(result: UXArchitectureResponse): string {
  const steps = result.quickAnswer.steps
    .map((step, index) => `${index + 1}. **${step.title}**: ${step.detail}`)
    .join("\n");
  const personas = result.personas
    .map(
      (persona, index) =>
        `### Persona ${index + 1}: ${persona.archetype}\n- Context: ${persona.context}\n- Goal: ${persona.primaryGoal}\n- Frustration: ${persona.coreFrustration}\n- Behavior: ${persona.keyBehavior}\n- Tech comfort: ${persona.techComfort}`,
    )
    .join("\n\n");
  const journey = result.journey
    .map(
      (stage, index) =>
        `${index + 1}. **${stage.stageName}** (${stage.emotionalState})\n   - Action: ${stage.userAction}\n   - Friction: ${stage.friction}\n   - Opportunity: ${stage.uxOpportunity}`,
    )
    .join("\n");
  const wireframes = result.wireframes
    .map(
      (screen) =>
        `### ${screen.screenName}\n${screen.purpose}\n${screen.blocks.map((block) => `- **${block.label}** (${block.type}): ${block.annotation}`).join("\n")}`,
    )
    .join("\n\n");

  return `# ${result.projectTitle}\n\n${result.valueProposition}\n\n> ${result.researchNote}\n\n## Quick answer\n\n${result.quickAnswer.answer}\n\n${steps}\n\n## User personas\n\n${personas}\n\n## User journey\n\n${journey}\n\n## Wireframe blueprint\n\n${wireframes}\n`;
}

function ExportToolbar({
  result,
  onNotify,
}: {
  result: UXArchitectureResponse;
  onNotify: (message: string) => void;
}) {
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(toMarkdown(result));
      onNotify("Markdown brief copied.");
    } catch {
      onNotify("Couldn't access the clipboard. Check browser permissions and try again.");
    }
  }

  function downloadSpec() {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ux-architecture.json";
    link.click();
    URL.revokeObjectURL(url);
    onNotify("JSON spec downloaded.");
  }

  return (
    <div className="flex flex-wrap gap-2 @3xl/brief:justify-end">
      <Button variant="secondary" onClick={copyBrief}>Copy Markdown brief</Button>
      <Button variant="secondary" onClick={downloadSpec}>Download JSON spec</Button>
    </div>
  );
}

function ResultTabs({ brief }: { brief: BriefState }) {
  const content: Array<{ label: string; content: ReactNode }> = [
    {
      label: "Personas",
      content: (
        <div className="grid grid-cols-1 gap-4 @4xl/brief:grid-cols-3 @4xl/brief:gap-5">
          {brief.data.personas.map((persona, index) => (
            <PersonaCard key={`${persona.archetype}-${index}`} persona={persona} index={index} />
          ))}
        </div>
      ),
    },
    {
      label: "Journey",
      content: <JourneyMap stages={brief.data.journey} />,
    },
    {
      label: "Wireframes",
      content: <WireframeGallery screens={brief.data.wireframes} platform={brief.platform} />,
    },
  ];

  return <Tabs label="Generated UX brief sections" tabs={content} />;
}

export function UXArchitectPage() {
  const [idea, setIdea] = useState("");
  const [platform, setPlatform] = useState<UXPlatform>("Mobile app");
  const [brief, setBrief] = useState<BriefState | null>(null);
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileGeneration, setTurnstileGeneration] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // Each finished request nudges the loading scene so it doesn't open with the same joke twice.
  const [completedRuns, setCompletedRuns] = useState(0);
  const outputRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [voiceNote, setVoiceNote] = useState("");
  // The last idea sent, so a fresh mic tap after a brief starts a new question instead of appending.
  const [lastRequestedIdea, setLastRequestedIdea] = useState("");
  const dictation = useSpeechDictation({
    maxLength: IDEA_MAX_LENGTH,
    onText: setIdea,
    // Like voice search: once the speaker pauses, their idea goes straight to the generator.
    onDone: (spokenIdea) => {
      if (spokenIdea.trim().length >= IDEA_MIN_LENGTH) void requestBrief(spokenIdea);
      else setVoiceNote("That's a little short. Add a few more words, then generate.");
    },
  });

  // When the output stacks below the form (small screens), bring the loading scene into view.
  useEffect(() => {
    const output = outputRef.current;
    if (!loading || !output) return;
    if (output.getBoundingClientRect().top <= window.innerHeight * 0.6) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    output.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
  }, [loading]);

  // ...and bring a failure message back into view, since it sits above the output.
  useEffect(() => {
    const alert = errorRef.current;
    if (!error || !alert) return;
    const { top, bottom } = alert.getBoundingClientRect();
    if (top < 72 || bottom > window.innerHeight) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      alert.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [error]);

  // Text that's already been answered doesn't count as a new draft.
  const hasFreshDraft =
    !dictation.listening && idea.trim().length >= IDEA_MIN_LENGTH && (idea !== lastRequestedIdea || Boolean(error));
  const voiceUnavailable = dictation.ready && !dictation.supported;
  const turnstileRequired = process.env.NODE_ENV === "production";

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  function toggleDictation() {
    if (dictation.listening) return dictation.stop();
    setVoiceNote("");
    const startFresh = idea === lastRequestedIdea && !error;
    if (startFresh) setIdea("");
    dictation.start(startFresh ? "" : idea);
  }

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Enter can submit the form even while the button shows its loading state.
    if (loading) return;
    // Submit exactly what's on screen; late speech results shouldn't rewrite the idea mid-request.
    dictation.cancel();
    void requestBrief(idea);
  }

  async function requestBrief(requestedIdea: string) {
    if (turnstileRequired && !turnstileToken) {
      setError("Complete the security check before generating a brief.");
      return;
    }

    const requestedPlatform = platform;
    const verificationToken = turnstileToken;
    setTurnstileToken("");
    if (turnstileRequired) setTurnstileGeneration((generation) => generation + 1);
    setLastRequestedIdea(requestedIdea);
    setVoiceNote("");
    setError("");
    setNotice("");
    setBrief(null);
    setLoading(true);

    try {
      const response = await fetch("/api/generate-ux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: requestedIdea,
          platform: requestedPlatform,
          ...(turnstileRequired ? { turnstileToken: verificationToken } : {}),
        }),
      });
      // Host timeouts can return non-JSON pages; fall back to a generic message.
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Couldn't generate a brief. Please try again.";
        throw new Error(message);
      }
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("result" in payload) ||
        !isUXArchitectureResponse(payload.result)
      ) {
        throw new Error("The generated brief was incomplete. Please try again.");
      }
      setBrief({ data: payload.result, platform: requestedPlatform, source: "generated" });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Couldn't connect to the generator. Please try again.",
      );
    } finally {
      setLoading(false);
      setCompletedRuns((runs) => runs + 1);
    }
  }

  function loadSample() {
    setBrief({ data: sampleBrief, platform: "Mobile app", source: "sample" });
    setError("");
    setNotice("");
  }

  return (
    <div className="av-root min-h-screen bg-[var(--av-color-surface)]">
      <section className="border-b border-white/10 bg-[var(--black)] pb-12 pt-28 text-white sm:pb-16 sm:pt-32">
        <div
          className={`${pageFrame} grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] xl:items-end xl:gap-16`}
        >
          <div className="min-w-0">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-light)]">
              Product strategy
            </p>
            <h1 className="max-w-4xl font-[family-name:var(--font-instrument-serif)] text-4xl leading-tight sm:text-6xl">
              UX Strategy &amp; Wireframe Architect
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Talk through a product idea or a problem you&apos;re stuck on. Get a straight answer,
              then a testable UX starting point: audience hypotheses, an end-to-end journey, and
              annotated wireframe blueprints for a solution.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone="brand">
                <Mic className="size-3.5" aria-hidden="true" />
                Talk, don&apos;t type
              </Badge>
              <Badge tone="brand">
                <FileDown className="size-3.5" aria-hidden="true" />
                Markdown &amp; JSON export
              </Badge>
              <Badge tone="warning">
                <FlaskConical className="size-3.5" aria-hidden="true" />
                Hypotheses, not research
              </Badge>
            </div>
          </div>
          <ol
            aria-label="What each brief includes"
            className="hidden gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-1"
          >
            {deliverables.map((item, index) => (
              <li
                key={item.title}
                className="flex min-w-0 gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--accent-light)]/15 text-xs font-bold text-[var(--accent-light)]"
                  aria-hidden="true"
                >
                  {formatStep(index)}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div
        className={`${pageFrame} grid grid-cols-1 gap-6 py-8 sm:py-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8 lg:py-12 xl:grid-cols-[22rem_minmax(0,1fr)] xl:gap-10 2xl:grid-cols-[24rem_minmax(0,1fr)]`}
      >
        {/* Only stick when the viewport is tall enough to show the whole form. */}
        <aside className="min-w-0 lg:self-start lg:[@media(min-height:50rem)]:sticky lg:[@media(min-height:50rem)]:top-24">
          <Card>
            <div className="av-card__body grid gap-5">
              <div>
                <h2 className="text-xl font-semibold text-[var(--av-color-ink)]">Just say it</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--av-color-muted)]">
                  A product idea, a question, or something you&apos;re stuck on. No typing needed;
                  leave out names and private details.
                </p>
              </div>

              <div className="grid gap-3 rounded-[var(--av-radius-lg)] border border-[color-mix(in_srgb,var(--av-color-brand)_22%,transparent)] bg-[color-mix(in_srgb,var(--av-color-brand)_6%,var(--av-color-canvas))] p-4">
                {voiceUnavailable ? (
                  <p className="text-sm leading-relaxed text-[var(--av-color-muted)]">
                    Voice input works in Chrome, Edge, and Safari. In this browser, type your idea below.
                  </p>
                ) : (
                  <>
                    {/* Rendered disabled until hydration confirms support, so the layout doesn't jump. */}
                    <Button
                      type="button"
                      size="lg"
                      variant={dictation.listening ? "danger" : hasFreshDraft ? "secondary" : "primary"}
                      className="w-full"
                      disabled={!dictation.supported || loading}
                      onClick={toggleDictation}
                    >
                      {dictation.listening ? (
                        <Square className="size-4" fill="currentColor" aria-hidden="true" />
                      ) : (
                        <Mic className="size-5" aria-hidden="true" />
                      )}
                      {dictation.listening ? "Stop listening" : "Tap and talk"}
                    </Button>
                    <p
                      role="status"
                      className={`text-center text-xs leading-relaxed ${
                        dictation.error ? "text-[var(--av-color-danger)]" : "text-[var(--av-color-muted)]"
                      }`}
                    >
                      {dictation.listening ? (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="size-2 shrink-0 rounded-full bg-[var(--av-color-danger)] motion-safe:animate-pulse"
                            aria-hidden="true"
                          />
                          Listening. Say it like you&apos;d tell a friend, then pause.
                        </span>
                      ) : dictation.error ? (
                        dictation.error
                      ) : dictation.limitReached ? (
                        `Stopped at the ${IDEA_MAX_LENGTH}-character limit. Edit the text to tighten it up.`
                      ) : dictation.stoppedForReview ? (
                        "Stopped. Edit if you like, then press Enter to send."
                      ) : (
                        voiceNote || "Tap, talk, then pause. Your answer and UX brief start on their own."
                      )}
                    </p>
                  </>
                )}
              </div>

              {!voiceUnavailable && (
                <div
                  className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[var(--av-color-muted)]"
                  aria-hidden="true"
                >
                  <span className="h-px flex-1 bg-[var(--av-color-border)]" />
                  or type it
                  <span className="h-px flex-1 bg-[var(--av-color-border)]" />
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--av-color-muted)]">
                  Try a starting point
                </p>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        dictation.cancel();
                        setVoiceNote("");
                        setIdea(preset.idea);
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              <form className="grid gap-4" onSubmit={generate}>
                <TextArea
                  label="Your idea or problem"
                  placeholder={
                    dictation.listening
                      ? "Listening… your words appear here."
                      : "I keep procrastinating on side projects. Or: an app that helps dog owners find trusted walkers."
                  }
                  hint={`${idea.length}/${IDEA_MAX_LENGTH} characters · Enter to send, Shift+Enter for a new line`}
                  value={idea}
                  onChange={(event) => setIdea(event.currentTarget.value)}
                  // Like a search box: Enter sends, Shift+Enter adds a line, and IME composition is left alone.
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }}
                  // Speech rewrites the field as it listens, so typing waits until it stops.
                  readOnly={dictation.listening}
                  minLength={IDEA_MIN_LENGTH}
                  maxLength={IDEA_MAX_LENGTH}
                  required
                  rows={3}
                />
                <SelectField
                  label="Target platform"
                  value={platform}
                  onChange={(event) => setPlatform(event.currentTarget.value as UXPlatform)}
                >
                  {UX_PLATFORMS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </SelectField>
                {turnstileRequired && (
                  <TurnstileChallenge
                    key={turnstileGeneration}
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
                    onToken={handleTurnstileToken}
                  />
                )}
                <Button
                  type="submit"
                  size="lg"
                  variant={hasFreshDraft || loading ? "primary" : "secondary"}
                  loading={loading}
                  disabled={turnstileRequired && !turnstileToken}
                >
                  Get answer &amp; UX brief
                </Button>
                <Button type="button" variant="ghost" onClick={loadSample}>
                  Explore a sample brief
                </Button>
              </form>

              {error && (
                <div ref={errorRef} className="scroll-mt-24">
                  <Alert tone="danger" title="Couldn't generate the brief">{error}</Alert>
                </div>
              )}
              <p className="text-xs leading-relaxed text-[var(--av-color-muted)]">
                What you enter is sent to OpenAI&apos;s API to create your answer and brief.
                Describe situations in general terms and leave out names, health details, and
                other private information. Answers are general guidance, not professional advice.
                This free demo limits how many briefs can be generated each day.
                {turnstileRequired &&
                  " Cloudflare Turnstile verifies requests to help prevent automated abuse."}
                {dictation.supported &&
                  " Voice input is transcribed by your browser's speech service, which may process audio online."}
              </p>
            </div>
          </Card>
        </aside>

        <section
          ref={outputRef}
          aria-label="UX architecture output"
          className="@container/brief min-w-0 scroll-mt-24"
        >
          {!brief && !loading && (
            <Card className="h-full">
              <div className="av-card__body grid h-full min-h-80 content-center justify-items-center gap-4 text-center">
                <div className="flex items-end justify-center pb-2" aria-hidden="true">
                  {previewTiles.map(({ label, Icon, tint, pose }) => (
                    <div
                      key={label}
                      className={`grid w-20 justify-items-center gap-2 rounded-xl border border-[var(--av-color-border)] bg-white px-2 pb-3 pt-3.5 shadow-[0_10px_24px_rgb(15_35_55/0.09)] sm:w-24 ${pose}`}
                    >
                      <span className={`grid size-10 place-items-center rounded-full ${tint}`}>
                        <Icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className="text-[0.6875rem] font-semibold text-[var(--av-color-muted)]">{label}</span>
                    </div>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-[var(--av-color-ink)]">
                  Your answer and brief start here
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-[var(--av-color-muted)]">
                  Ask about an idea or a problem, or explore the sample to see a quick answer,
                  personas, a journey map, and interactive wireframe blueprints.
                </p>
              </div>
            </Card>
          )}

          {loading && (
            <Card className="h-full">
              <BriefLoadingScene run={completedRuns} />
            </Card>
          )}

          {brief && (
            <div className="grid gap-5">
              {brief.source === "sample" ? (
                <Alert tone="warning" title="Sample preview">
                  This is a fixed example, not AI-generated output or user research.
                </Alert>
              ) : (
                <Alert tone="info" title="Treat this as a starting hypothesis">
                  The answer is general guidance, not professional advice. Validate the audience,
                  pain points, and journey with real users before making product decisions.
                </Alert>
              )}
              <QuickAnswerCard quickAnswer={brief.data.quickAnswer} />
              <Card>
                <div className="grid gap-5 p-5 wrap-break-word @3xl/brief:grid-cols-[minmax(0,1fr)_auto] @3xl/brief:items-start @3xl/brief:p-6">
                  <div className="grid min-w-0 gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--av-color-brand)]">
                        UX architecture
                      </p>
                      <Badge>{brief.platform}</Badge>
                    </div>
                    <h2 className="text-[1.5rem] font-semibold leading-tight text-[var(--av-color-ink)] @3xl/brief:text-[2rem]">
                      {brief.data.projectTitle}
                    </h2>
                    <p className="max-w-3xl leading-relaxed text-[var(--av-color-muted)]">
                      {brief.data.valueProposition}
                    </p>
                    <p className="max-w-3xl border-l-2 border-[var(--av-color-brand)] pl-3 text-sm leading-relaxed text-[var(--av-color-muted)]">
                      {brief.data.researchNote}
                    </p>
                  </div>
                  <ExportToolbar result={brief.data} onNotify={setNotice} />
                </div>
              </Card>
              {notice && <Toast title={notice} />}
              <ResultTabs brief={brief} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
