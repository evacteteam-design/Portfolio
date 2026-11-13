import type { Tone } from "@akhil-vanga/design-system";

export interface LoadingCrewMember {
  id: "persona" | "journey" | "wireframe";
  name: string;
  /** The artboard this crew member sketches while the brief is generated. */
  board: string;
  tone: Extract<Tone, "brand" | "success" | "warning">;
  quips: readonly string[];
}

// One artboard is "active" per slot; the crew takes turns in this order.
export const LOADING_CREW: readonly LoadingCrewMember[] = [
  {
    id: "persona",
    name: "Persona Pat",
    board: "Personas",
    tone: "brand",
    quips: [
      "Interviewing imaginary users. Very cooperative bunch.",
      "Giving every persona a questionable coffee order.",
      "Naming personas. Priya now owns a dog called Biscuit.",
      "Asking “but what’s the user’s goal?” for the fifth time.",
    ],
  },
  {
    id: "journey",
    name: "Journey Jo",
    board: "Journey",
    tone: "success",
    quips: [
      "Plotting a journey with one very dramatic dip.",
      "Adding a sad face at step three. For realism.",
      "Hunting for the exact moment users close the tab.",
      "Turning friction into opportunities. Basically alchemy.",
    ],
  },
  {
    id: "wireframe",
    name: "Wireframe Wes",
    board: "Wireframes",
    tone: "warning",
    quips: [
      "Drawing boxes. So many boxes.",
      "Debating the hamburger menu. Again.",
      "Nudging a button 2px left. Then back.",
      "Making the logo bigger. (Kidding. Mostly.)",
      "Squinting at the grid until everything lines up.",
    ],
  },
];

// Long enough to read one joke, short enough that the scene keeps moving.
export const LOADING_SLOT_MS = 3600;
export const LONG_WAIT_MS = 30_000;

/** Who is working on which joke at a given tick. `run` varies the jokes between generations. */
export function getLoadingMoment(tick: number, run = 0) {
  const crewIndex = tick % LOADING_CREW.length;
  const crew = LOADING_CREW[crewIndex];
  const round = Math.floor(tick / LOADING_CREW.length);
  return { crewIndex, crew, quip: crew.quips[(round + run) % crew.quips.length] };
}

/**
 * How many times the crew has picked up a board by this tick (0 = not started).
 * The scene re-keys a board with this count so its build animation replays on every turn.
 */
export function getBoardPlays(tick: number, boardIndex: number) {
  if (tick < boardIndex) return 0;
  return Math.floor((tick - boardIndex) / LOADING_CREW.length) + 1;
}

export function isLongWait(tick: number) {
  return tick * LOADING_SLOT_MS >= LONG_WAIT_MS;
}
