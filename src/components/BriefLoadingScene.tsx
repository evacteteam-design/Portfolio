"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Badge, Card, Skeleton } from "@akhil-vanga/design-system";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  LOADING_CREW,
  LOADING_SLOT_MS,
  getBoardPlays,
  getLoadingMoment,
  isLongWait,
} from "@/lib/ux-architect-loading";

// Delays are set per element so each artboard builds up piece by piece.
const at = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

// Confetti shapes are centred on (0, 0) so they spin and scale around themselves.
const confetti = {
  dot: "M-2.6 0 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0Z",
  square: "M-2.4 -2.4 H2.4 V2.4 H-2.4Z",
  triangle: "M0 -3.4 L3.2 2.4 H-3.2Z",
};
const burstParticles = [
  { dx: -46, dy: -34, paint: "ux-f-brand", shape: confetti.square },
  { dx: 44, dy: -40, paint: "ux-f-amber", shape: confetti.dot },
  { dx: -52, dy: 10, paint: "ux-f-amber", shape: confetti.triangle },
  { dx: 50, dy: 14, paint: "ux-f-brand", shape: confetti.dot },
  { dx: -22, dy: 46, paint: "ux-f-success", shape: confetti.triangle },
  { dx: 24, dy: 48, paint: "ux-f-amber", shape: confetti.square },
];

function Burst({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {burstParticles.map((particle) => (
        <path
          key={particle.dx}
          d={particle.shape}
          className={`ux-burst ${particle.paint}`}
          style={{ "--dx": `${particle.dx}px`, "--dy": `${particle.dy}px`, "--d": `${delay}s` } as CSSProperties}
        />
      ))}
    </g>
  );
}

type CursorKind = "persona" | "journey" | "wireframe";

// A Figma-style multiplayer cursor: arrow, name tag with a role glyph, and a click ripple.
function Cursor({ kind }: { kind: CursorKind }) {
  return (
    <g className={`ux-cursor ux-cursor--${kind}`}>
      <circle className="ux-ripple" r="7" />
      <path className="ux-cursor__arrow" d="M0 0 L0 17 L4.6 12.9 L7.6 19.6 L10.2 18.4 L7.3 11.8 L13.2 11.8 Z" />
      <g transform="translate(11 17)">
        <rect className="ux-cursor__tag" width="30" height="13" rx="6.5" />
        <g className="ux-stroke ux-s-white" strokeWidth="1.4">
          {kind === "persona" && (
            <>
              <circle cx="15" cy="4.6" r="1.8" className="ux-f-white" stroke="none" />
              <path d="M11.4 10.4 Q15 5.8 18.6 10.4" />
            </>
          )}
          {kind === "journey" && <path d="M9.5 8.6 L13 4.4 L16.6 8 L20.6 4.4" />}
          {kind === "wireframe" && (
            <>
              <rect x="10" y="3" width="4.6" height="3.4" rx="0.8" />
              <rect x="15.4" y="3" width="4.6" height="3.4" rx="0.8" />
              <rect x="10" y="7.6" width="10" height="2.6" rx="0.8" />
            </>
          )}
        </g>
      </g>
    </g>
  );
}

function PersonaArt() {
  return (
    <svg viewBox="0 0 200 220" className="ux-art" focusable="false">
      <g className="ux-pop" style={at(0.1)}>
        <g className="ux-stroke ux-s-brand" strokeWidth="2.6">
          <path d="M91 30 L88 21 M100 28 V17 M109 30 L112 21" />
        </g>
        <circle cx="100" cy="58" r="31" className="ux-f-brand-soft ux-s-brand" strokeWidth="2.6" />
      </g>
      <g className="ux-pop" style={at(0.45)}>
        <ellipse cx="91" cy="55" rx="3" ry="3.5" className="ux-f-ink" />
        <ellipse cx="109" cy="55" rx="3" ry="3.5" className="ux-f-ink" />
        <circle cx="81" cy="67" r="4.2" className="ux-f-danger-soft" />
        <circle cx="119" cy="67" r="4.2" className="ux-f-danger-soft" />
      </g>
      <path
        d="M88 68 Q100 80 112 68"
        pathLength="1"
        className="ux-stroke ux-s-ink ux-draw"
        strokeWidth="2.8"
        style={at(0.6)}
      />
      <g className="ux-drop" style={at(1.5)}>
        <rect x="79" y="47" width="19" height="13" rx="5" className="ux-f-ink" />
        <rect x="102" y="47" width="19" height="13" rx="5" className="ux-f-ink" />
        <path d="M98 51.5 H102" className="ux-stroke ux-s-ink" strokeWidth="2.6" />
        <path d="M83 51 L87 50" className="ux-stroke ux-s-white" strokeWidth="1.8" opacity="0.55" />
        <path d="M106 51 L110 50" className="ux-stroke ux-s-white" strokeWidth="1.8" opacity="0.55" />
      </g>

      <rect x="58" y="102" width="84" height="9" rx="4.5" className="ux-f-bar ux-grow ux-grow--center" style={at(0.8)} />
      <rect x="72" y="117" width="56" height="7" rx="3.5" className="ux-f-bar ux-grow ux-grow--center" style={at(0.95)} />

      <g className="ux-pop" style={at(1.1)}>
        <rect x="22" y="136" width="50" height="16" rx="8" className="ux-f-brand-soft" />
        <rect x="31" y="142.5" width="32" height="3" rx="1.5" className="ux-f-brand" opacity="0.55" />
      </g>
      <g className="ux-pop" style={at(1.25)}>
        <rect x="78" y="136" width="58" height="16" rx="8" className="ux-f-success-soft" />
        <rect x="87" y="142.5" width="40" height="3" rx="1.5" className="ux-f-success" opacity="0.55" />
      </g>
      <g className="ux-pop" style={at(1.4)}>
        <rect x="142" y="136" width="36" height="16" rx="8" className="ux-f-amber-soft" />
        <rect x="150" y="142.5" width="20" height="3" rx="1.5" className="ux-f-amber" opacity="0.8" />
      </g>

      <g className="ux-pop" style={at(1.55)}>
        <rect x="22" y="162" width="156" height="44" rx="10" className="ux-f-surface ux-s-line" strokeWidth="1.2" />
        <circle cx="40" cy="184" r="9" className="ux-f-danger-soft" />
        <path d="M40 179 V185" className="ux-stroke ux-s-danger" strokeWidth="2.2" />
        <circle cx="40" cy="189.2" r="1.3" className="ux-f-danger" />
        <rect x="56" y="175" width="100" height="6" rx="3" className="ux-f-bar" />
        <rect x="56" y="188" width="72" height="6" rx="3" className="ux-f-bar" />
      </g>

      <Burst x={100} y={112} delay={1.9} />
      <Cursor kind="persona" />
    </svg>
  );
}

function JourneyArt() {
  return (
    <svg viewBox="0 0 200 220" className="ux-art" focusable="false">
      <rect x="20" y="16" width="72" height="9" rx="4.5" className="ux-f-bar ux-grow" style={at(0.1)} />
      <g className="ux-pop" style={at(0.25)}>
        <rect x="134" y="14" width="46" height="13" rx="6.5" className="ux-f-brand-soft" />
        <rect x="142" y="19" width="30" height="3" rx="1.5" className="ux-f-brand" opacity="0.55" />
      </g>

      <g className="ux-pop" style={at(0.3)}>
        <rect x="14" y="38" width="172" height="124" rx="10" className="ux-f-surface ux-s-line" strokeWidth="1.2" />
        <path d="M24 100 H176" className="ux-stroke ux-s-line" strokeWidth="1.4" strokeDasharray="2 5" />
      </g>
      <path
        d="M28 104 C40 104 54 70 68 70 C84 70 92 138 106 138 C122 138 130 96 144 96 C158 96 164 62 176 62"
        pathLength="1"
        className="ux-stroke ux-s-brand ux-draw"
        strokeWidth="3.4"
        style={{ ...at(0.6), "--dur": "1.6s" } as CSSProperties}
      />
      {[
        { x: 28, y: 104, stroke: "ux-s-brand" },
        { x: 68, y: 70, stroke: "ux-s-brand" },
        { x: 106, y: 138, stroke: "ux-s-danger" },
        { x: 144, y: 96, stroke: "ux-s-brand" },
        { x: 176, y: 62, stroke: "ux-s-success" },
      ].map((dot, index) => (
        <circle
          key={dot.x}
          cx={dot.x}
          cy={dot.y}
          r="5.5"
          className={`ux-f-white ux-pop ${dot.stroke}`}
          strokeWidth="2.6"
          style={at(0.8 + index * 0.32)}
        />
      ))}

      <g className="ux-ouch" style={at(1.55)}>
        <circle cx="106" cy="116" r="8" className="ux-f-danger-soft ux-s-danger" strokeWidth="1.6" />
        <path d="M106 111.5 V116" className="ux-stroke ux-s-danger" strokeWidth="2" />
        <circle cx="106" cy="119.8" r="1.1" className="ux-f-danger" />
      </g>

      <g className="ux-marker">
        <circle cx="176" cy="62" r="8.5" className="ux-f-amber ux-s-white" strokeWidth="2" />
        <circle cx="173.2" cy="60.5" r="1.1" className="ux-f-ink" />
        <circle cx="178.8" cy="60.5" r="1.1" className="ux-f-ink" />
        <path d="M172.8 64.4 Q176 67.2 179.2 64.4" className="ux-stroke ux-s-ink" strokeWidth="1.3" />
      </g>

      {[28, 68, 106, 144, 176].map((x, index) => (
        <rect
          key={x}
          x={x - 12}
          y="172"
          width="24"
          height="5"
          rx="2.5"
          className="ux-f-bar ux-grow ux-grow--center"
          style={at(1.1 + index * 0.12)}
        />
      ))}

      <g className="ux-pop" style={at(1.9)}>
        <rect x="14" y="188" width="172" height="22" rx="11" className="ux-f-brand-soft" />
        <circle cx="30" cy="199" r="6" className="ux-f-amber ux-glow" />
        <path d="M27.4 205 H32.6" className="ux-stroke ux-s-ink" strokeWidth="1.6" />
        <rect x="44" y="196" width="96" height="6" rx="3" className="ux-f-brand" opacity="0.4" />
      </g>

      <Burst x={100} y={100} delay={2} />
      <Cursor kind="journey" />
    </svg>
  );
}

function WireframeArt() {
  return (
    <svg viewBox="0 0 200 220" className="ux-art" focusable="false">
      <g className="ux-pop" style={at(0.1)}>
        <rect x="14" y="14" width="172" height="24" rx="8" className="ux-f-surface ux-s-line" strokeWidth="1.2" />
        <circle cx="170" cy="26" r="6" className="ux-f-brand-soft" />
      </g>
      <g className="ux-burger">
        <rect x="24" y="21" width="14" height="2.6" rx="1.3" className="ux-f-ink ux-burger__top" />
        <rect x="24" y="26.2" width="14" height="2.6" rx="1.3" className="ux-f-ink ux-burger__mid" />
        <rect x="24" y="31.4" width="14" height="2.6" rx="1.3" className="ux-f-ink ux-burger__bottom" />
      </g>
      <circle cx="100" cy="26" r="6.5" className="ux-f-brand ux-logo" />

      <g className="ux-pop" style={at(0.4)}>
        <rect x="14" y="46" width="172" height="66" rx="10" className="ux-f-brand-soft" />
        <circle cx="152" cy="66" r="8" className="ux-f-amber" />
        <path d="M24 104 L58 74 L82 94 L112 68 L176 104 Z" className="ux-f-brand" opacity="0.75" />
        <path d="M58 74 L66 81 L60 83 L54 78Z" className="ux-f-white" opacity="0.7" />
      </g>

      <rect x="14" y="122" width="118" height="8" rx="4" className="ux-f-bar ux-grow" style={at(0.75)} />
      <rect x="14" y="137" width="84" height="6" rx="3" className="ux-f-bar ux-grow" style={at(0.9)} />

      <g className="ux-pop" style={at(1.05)}>
        <rect x="14" y="152" width="82" height="34" rx="8" className="ux-f-surface ux-s-line" strokeWidth="1.2" />
        <circle cx="30" cy="169" r="7" className="ux-f-success-soft" />
        <rect x="43" y="162" width="42" height="5" rx="2.5" className="ux-f-bar" />
        <rect x="43" y="172" width="28" height="5" rx="2.5" className="ux-f-bar" />
      </g>
      <g className="ux-pop" style={at(1.2)}>
        <rect x="104" y="152" width="82" height="34" rx="8" className="ux-f-surface ux-s-line" strokeWidth="1.2" />
        <circle cx="120" cy="169" r="7" className="ux-f-amber-soft" />
        <rect x="133" y="162" width="42" height="5" rx="2.5" className="ux-f-bar" />
        <rect x="133" y="172" width="28" height="5" rx="2.5" className="ux-f-bar" />
      </g>

      <g className="ux-cta">
        <rect x="14" y="194" width="172" height="18" rx="9" className="ux-f-brand ux-pop" style={at(1.4)} />
        <rect x="76" y="201.5" width="48" height="3" rx="1.5" className="ux-f-white ux-pop" opacity="0.85" style={at(1.5)} />
      </g>

      <g className="ux-sticky" style={at(1.8)}>
        <g transform="rotate(8 163 100)">
          <rect x="148" y="86" width="30" height="30" rx="3" className="ux-f-amber-soft ux-s-amber" strokeWidth="1.4" />
          <path d="M153 95 H172 M153 101 H168 M153 107 H165" className="ux-stroke ux-s-amber" strokeWidth="1.6" />
        </g>
      </g>

      <Burst x={100} y={120} delay={2} />
      <Cursor kind="wireframe" />
    </svg>
  );
}

const arts = [PersonaArt, JourneyArt, WireframeArt];

function WaitingBoard() {
  return (
    <div className="grid content-start gap-3 p-4">
      <Skeleton width="40%" height="0.75rem" />
      <Skeleton height="4.25rem" />
      <Skeleton width="82%" height="0.625rem" />
      <Skeleton width="56%" height="0.625rem" />
    </div>
  );
}

function Decorations() {
  return (
    <>
      <svg viewBox="-6 -6 12 12" className="ux-deco ux-deco--triangle ux-twinkle" focusable="false">
        <path d="M0 -4.2 L4.4 3.4 H-4.4Z" className="ux-stroke ux-s-brand" strokeWidth="2.2" />
      </svg>
      <svg viewBox="0 0 34 12" className="ux-deco ux-deco--squiggle ux-float" focusable="false">
        <path d="M2 8 Q6.5 0 11 6 T20 6 T30 4" className="ux-stroke ux-s-success" strokeWidth="2.4" />
      </svg>
      <svg viewBox="-6 -6 12 12" className="ux-deco ux-deco--plus ux-float" focusable="false">
        <path d="M0 -4 V4 M-4 0 H4" className="ux-stroke ux-s-amber" strokeWidth="2.4" />
      </svg>
      <svg viewBox="-7 -7 14 14" className="ux-deco ux-deco--ring ux-twinkle" focusable="false">
        <circle r="4.6" className="ux-stroke ux-s-brand" strokeWidth="2" />
      </svg>
    </>
  );
}

const STATUS = "Building your UX brief. This usually takes under a minute.";
const STATUS_LONG = "Still building your UX brief. Detailed ideas can take a little longer.";

/** Playful loading state: the three deliverables get sketched by an imaginary design crew. */
export function BriefLoadingScene({ run }: { run: number }) {
  const reduced = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), LOADING_SLOT_MS);
    return () => window.clearInterval(timer);
  }, []);

  const { crewIndex, crew, quip } = getLoadingMoment(tick, run);
  const longWait = isLongWait(tick);
  // With reduced motion the scene is a finished still: every board built, nobody moving.
  const activeIndex = reduced ? -1 : crewIndex;
  const narrowIndex = reduced ? LOADING_CREW.length - 1 : crewIndex;

  return (
    <div className="av-card__body grid min-h-80 content-center justify-items-center gap-4 text-center">
      <p role="status" className="av-sr-only">
        {longWait ? STATUS_LONG : STATUS}
      </p>

      <div
        aria-hidden="true"
        className="ux-scene relative w-full max-w-4xl rounded-[var(--av-radius-lg)] border border-[var(--av-color-border)] p-4 sm:p-5"
      >
        <Decorations />
        <div className="relative z-10 grid gap-3 @lg/brief:grid-cols-3 @lg/brief:gap-4">
          {LOADING_CREW.map((member, index) => {
            const Art = arts[index];
            const plays = reduced ? 1 : getBoardPlays(tick, index);
            const active = index === activeIndex;
            return (
              <div
                key={member.id}
                className={`${index === narrowIndex ? "" : "hidden "}mx-auto w-full max-w-[15rem] min-w-0 @lg/brief:mx-0 @lg/brief:block @lg/brief:max-w-none`}
              >
                <div className="mb-2 flex items-center justify-center gap-2 @lg/brief:justify-start">
                  <Badge tone={active ? member.tone : "neutral"}>{member.board}</Badge>
                  {active && (
                    <span className="ux-typing">
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                </div>
                <Card className="ux-scene__board" data-active={active} data-tone={member.tone}>
                  {plays === 0 ? <WaitingBoard /> : <Art key={plays} />}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <div aria-hidden="true" className="grid justify-items-center gap-2">
        <p className="font-semibold text-[var(--av-color-ink)]">Building your UX brief…</p>
        {reduced ? (
          <p className="max-w-md text-sm text-[var(--av-color-muted)]">
            Sketching personas, a journey map, and wireframe screens.
          </p>
        ) : (
          <div
            key={tick}
            className="ux-quip flex min-h-[4.5rem] flex-col items-center gap-1.5 sm:min-h-11 sm:flex-row sm:gap-2.5"
          >
            <Badge tone={crew.tone}>{crew.name}</Badge>
            <p className="max-w-md text-sm text-[var(--av-color-ink)]">{quip}</p>
          </div>
        )}
        <p className="max-w-sm text-xs text-[var(--av-color-muted)]">
          {longWait
            ? "Still sketching. Detailed ideas can take a little longer."
            : "Usually under a minute. Hang tight."}
        </p>
      </div>
    </div>
  );
}
