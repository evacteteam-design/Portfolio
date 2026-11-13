export const UX_PLATFORMS = [
  "Mobile app",
  "Web SaaS",
  "Enterprise dashboard",
] as const;

export type UXPlatform = (typeof UX_PLATFORMS)[number];

export interface UserPersona {
  archetype: string;
  context: string;
  primaryGoal: string;
  coreFrustration: string;
  keyBehavior: string;
  techComfort: string;
}

export interface JourneyStage {
  stageName: string;
  userAction: string;
  emotionalState: string;
  friction: string;
  uxOpportunity: string;
}

export const WIREFRAME_BLOCK_TYPES = [
  "header",
  "hero",
  "search",
  "metric",
  "card-grid",
  "list",
  "form",
  "chart",
  "cta",
  "tabs",
  "map",
  "media",
  "chat",
  "calendar",
] as const;

export type WireframeBlockType = (typeof WIREFRAME_BLOCK_TYPES)[number];

export interface WireframeBlock {
  type: WireframeBlockType;
  label: string;
  annotation: string;
}

export interface WireframeScreen {
  screenName: string;
  purpose: string;
  blocks: WireframeBlock[];
}

export interface UXArchitectureResponse {
  projectTitle: string;
  valueProposition: string;
  researchNote: string;
  personas: [UserPersona, UserPersona, UserPersona];
  journey: [JourneyStage, JourneyStage, JourneyStage, JourneyStage, JourneyStage];
  wireframes: [WireframeScreen, WireframeScreen, WireframeScreen];
}

// Shared by the generation prompt, server normalization, and validation so all three agree.
export const UX_TEXT_LIMITS: {
  brief: Record<Exclude<keyof UXArchitectureResponse, "personas" | "journey" | "wireframes">, number>;
  persona: Record<keyof UserPersona, number>;
  journeyStage: Record<keyof JourneyStage, number>;
  screen: Record<Exclude<keyof WireframeScreen, "blocks">, number>;
  block: Record<Exclude<keyof WireframeBlock, "type">, number>;
} = {
  brief: { projectTitle: 100, valueProposition: 240, researchNote: 240 },
  persona: {
    archetype: 80,
    context: 240,
    primaryGoal: 200,
    coreFrustration: 200,
    keyBehavior: 200,
    techComfort: 100,
  },
  journeyStage: {
    stageName: 80,
    userAction: 200,
    emotionalState: 120,
    friction: 200,
    uxOpportunity: 200,
  },
  screen: { screenName: 80, purpose: 200 },
  block: { label: 80, annotation: 160 },
};

export const UX_COUNTS = {
  personas: 3,
  journeyStages: 5,
  screens: 3,
  minBlocks: 3,
  maxBlocks: 6,
} as const;

const wireframeBlockTypeSet: ReadonlySet<string> = new Set(WIREFRAME_BLOCK_TYPES);

export function isWireframeBlockType(
  value: unknown,
): value is WireframeBlockType {
  return typeof value === "string" && wireframeBlockTypeSet.has(value);
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isBoundedString = (value: unknown, maxLength: number): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;

const hasTextFields = (
  value: Record<string, unknown>,
  limits: Readonly<Record<string, number>>,
) =>
  Object.entries(limits).every(([key, maxLength]) =>
    isBoundedString(value[key], maxLength),
  );

function isPersona(value: unknown): value is UserPersona {
  return isRecord(value) && hasTextFields(value, UX_TEXT_LIMITS.persona);
}

function isJourneyStage(value: unknown): value is JourneyStage {
  return isRecord(value) && hasTextFields(value, UX_TEXT_LIMITS.journeyStage);
}

function isWireframeBlock(value: unknown): value is WireframeBlock {
  return (
    isRecord(value) &&
    isWireframeBlockType(value.type) &&
    hasTextFields(value, UX_TEXT_LIMITS.block)
  );
}

function isWireframeScreen(value: unknown): value is WireframeScreen {
  return (
    isRecord(value) &&
    hasTextFields(value, UX_TEXT_LIMITS.screen) &&
    Array.isArray(value.blocks) &&
    value.blocks.length >= UX_COUNTS.minBlocks &&
    value.blocks.length <= UX_COUNTS.maxBlocks &&
    value.blocks.every(isWireframeBlock)
  );
}

export function isUXArchitectureResponse(
  value: unknown,
): value is UXArchitectureResponse {
  return (
    isRecord(value) &&
    hasTextFields(value, UX_TEXT_LIMITS.brief) &&
    Array.isArray(value.personas) &&
    value.personas.length === UX_COUNTS.personas &&
    value.personas.every(isPersona) &&
    Array.isArray(value.journey) &&
    value.journey.length === UX_COUNTS.journeyStages &&
    value.journey.every(isJourneyStage) &&
    Array.isArray(value.wireframes) &&
    value.wireframes.length === UX_COUNTS.screens &&
    value.wireframes.every(isWireframeScreen)
  );
}
