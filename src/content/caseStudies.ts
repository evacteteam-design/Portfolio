export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  role: string;
  platform: string;
  users: string;
  duration: string;
  impactHeadline: string;
  lede: string;
  tags: string[];
  accentColor: string;
  accentDark: string;
  heroScreenUrl: string;
  heroScreenCaption: string;
  previewImage: string;
  sections: CaseStudySection[];
  stats: Stat[];
  insights: Insight[];
  process: ProcessStep[];
  decisions: Decision[];
  constraints: Constraint[];
  impact: ImpactMetric[];
  beforeAfter?: BeforeAfter[];
  contextTail?: string;
  researchTail?: string;
  tabs?: StudyTab[];
}

export type StudyTabId = "problem" | "solution" | "challenge" | "summary";

export interface StudyTab {
  id: StudyTabId;
  title: string;
  body: string;
  image: string;
  alt: string;
  captionTitle: string;
  captionBody: string;
  imageUrl?: string;
}

export interface CaseStudySection {
  id: string;
  label: string;
  number: string;
  title: string;
  titleAccent?: string;
  body: string[];
  quote?: { text: string; cite: string };
}

export interface Stat {
  value: string;
  suffix?: string;
  description: string;
  caveat?: string;
  barColor: string;
}

export interface Insight {
  number: string;
  title: string;
  body: string;
  quote?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

export interface Decision {
  number: string;
  label: string;
  title: string;
  body: string[];
  impact: string;
  flip?: boolean;
  image?: string;
  imageCaption?: string;
  imageUrl?: string;
}

export interface Constraint {
  title: string;
  body: string;
}

export interface ImpactMetric {
  value: string;
  suffix?: string;
  label: string;
  caveat?: string;
}

export interface DeltaItem {
  type: "bad" | "good";
  text: string;
}

export interface BeforeAfter {
  label: string;
  desc: string;
  beforeImage: string;
  beforeAlt: string;
  beforeLabel: string;
  beforeCaption: string;
  afterImage: string;
  afterAlt: string;
  afterLabel: string;
  afterCaption: string;
  afterUrl?: string;
  deltaBefore: DeltaItem[];
  deltaAfter: DeltaItem[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "ccs-trade-center",
    title: "CCS+ Trade Center",
    subtitle: "Redesigning how 10,000 pilots schedule their lives",
    client: "United Airlines",
    year: "2023–2025",
    role: "Lead UX/UI Designer",
    platform: "Desktop · Tablet · Mobile",
    users: "10,000+ crew",
    duration: "2 years · 6+ sprints",
    impactHeadline: "~65% time reduction",
    tags: ["United Airlines", "2023–2025", "Lead UX/UI Designer", "10,000+ Pilots", "Enterprise · Internal Tool"],
    accentColor: "#4BA3E3",
    accentDark: "#002244",
    heroScreenUrl: "/images/ccs-hero.png",
    heroScreenCaption: "ccsplus.ual.com / trade-center / trips — Trade Board · 217 trips",
    previewImage: "/images/ccs-preview.png",
    lede: "When 10,000 crew members dread opening their scheduling app, every second of friction has a real operational cost. I led the redesign of CCS+ Trade Center — United Airlines' highest-traffic pilot-facing feature — from a system pilots feared to one they trusted.",
    sections: [
      {
        id: "context",
        label: "Context",
        number: "01",
        title: "One platform.",
        titleAccent: "15,000 pilots.",
        body: [
          "CCS+ is United Airlines' internal scheduling platform built to replace two siloed legacy tools — the <strong>Crew Communication System</strong> (a 90s-era internal calendar) and <strong>Crew Companion</strong> (a third-party trading app). Both were non-responsive, completely disconnected, and deeply frustrating to use.",
          "The <strong>Trade Center</strong> is CCS+'s highest-traffic feature — where pilots trade trips, pick up open time, submit requests, and verify schedule legality every single day. And it was universally dreaded.",
          "The scheduling window is often <strong>minutes long</strong>. When a trip opens, the fastest pilot who can correctly evaluate it wins it. An interface requiring 30 seconds of manual re-setup before filtering isn't just annoying — it directly costs pilots income.",
        ],
        quote: {
          text: "Before CCS+, the tools were so outdated that pilots had to switch between two separate apps just to complete one task. There was no trust in the system. They were scared to click things.",
          cite: "Research finding across CLE, ORD, IAH pilot base sessions",
        },
      },
      {
        id: "research",
        label: "Research & Discovery",
        number: "02",
        title: "The problem wasn't",
        titleAccent: "confusion.",
        body: [
          "Research sessions across multiple bases revealed something more nuanced than typical usability issues. Pilots weren't lost — they knew what the app was supposed to do. They just <strong>didn't trust it to do it without consequences.</strong> Pilots would hover over a button and pause, visibly unsure whether clicking would trigger something irreversible.",
        ],
      },
      {
        id: "process",
        label: "Design Process",
        number: "04",
        title: "From requirements to",
        titleAccent: "shipped code.",
        body: [
          "Every CCS+ feature followed the same four-stage repeatable process — increasing velocity while maintaining alignment with engineering, stakeholders, and the pilots who would use it every day.",
        ],
      },
      {
        id: "decisions",
        label: "Key Design Decisions",
        number: "05",
        title: "Five decisions that",
        titleAccent: "changed how pilots work.",
        body: [
          "Each grounded in research, complaint logs, and iterative testing. Each with downstream consequences across the platform.",
        ],
      },
      {
        id: "constraints",
        label: "Constraints",
        number: "06",
        title: "Designing inside",
        titleAccent: "real constraints.",
        body: [
          "CCS+ was built on an established design system, with engineering managing complex business rules, a compressed timeline, and stakeholders making decisions affecting 10,000+ pilots.",
        ],
      },
    ],
    stats: [
      { value: "10k", suffix: "+", description: "Active pilots using CCS+ daily", barColor: "#4BA3E3" },
      { value: "217", description: "Trips visible per session — all scannable without navigating away", barColor: "#E8A020" },
      { value: "~65", suffix: "%", description: "Estimated reduction in trip evaluation time", caveat: "Based on pilot feedback sessions", barColor: "#4BA3E3" },
      { value: "18", suffix: "mo", description: "Deadhead complaint in backlog — resolved in one sprint", barColor: "#D94F4F" },
    ],
    insights: [
      {
        number: "01",
        title: "Information overload, no hierarchy",
        body: "Hundreds of trips with identical visual weight. New trips, changed trips, and stale data looked exactly the same. Pilots scrolled endlessly.",
        quote: "I can't tell which trips just opened up. Everything looks the same.",
      },
      {
        number: "02",
        title: "Filter state reset every session",
        body: "Base, equipment, and position had to be re-entered from scratch every session — every day, for years. The same 3-step ritual hundreds of times.",
        quote: "I reset these filters every day. It's muscle memory — bad muscle memory.",
      },
      {
        number: "03",
        title: "18 months of deadhead complaints",
        body: "Pilots couldn't reliably distinguish deadhead (positioning) flights from operating ones. The DH indicator existed but was visually buried.",
        quote: "I accepted a trip thinking I was flying it. I was DHing the whole first leg.",
      },
    ],
    process: [
      {
        number: "01",
        title: "Requirements & Stakeholder Alignment",
        body: "Decomposed business requirements with product owners, engineers, and pilot union liaisons. Mapped every use case against real pilot workflows observed in research.",
      },
      {
        number: "02",
        title: "Wireframes & Information Architecture",
        body: "Low-fidelity structuring of every screen. Established information hierarchy, interaction patterns, and navigation flows before any visual design began.",
      },
      {
        number: "03",
        title: "High-Fidelity Design & Prototyping",
        body: "Pixel-level Figma designs with interactive prototypes. Validated with pilots via moderated usability sessions at CLE, ORD, and IAH bases.",
      },
      {
        number: "04",
        title: "Engineering Handoff & QA",
        body: "Detailed specs with redlines, token references, and edge-case documentation. Stayed embedded with engineering through implementation for real-time decisions.",
      },
    ],
    decisions: [
      {
        number: "01",
        label: "Smart Filter Defaults",
        title: "Filters that already know who you are",
        body: [
          "Every pilot has a base, equipment type, and seat position. Before the redesign, every session started from zero — CLE, 737, Captain re-entered manually every single day. That's 30–40 seconds gone before useful work begins.",
          "The redesign pulls these from the pilot's profile and pre-loads on session start. The filter modal uses a single configurable template component working identically across Trade Board and Category Summary.",
        ],
        impact: "Eliminated 3–5 repetitive inputs per session. First meaningful action 40+ seconds earlier. Zero daily re-entry for 10,000+ pilots.",
        image: "/images/filter modal to filter trip list.png",
        imageCaption: "Filter panel: CLE/737/Captain pre-populated from pilot profile. Full calendar context, availability toggles, save-as-template.",
        imageUrl: "Filter trip list modal",
      },
      {
        number: "02",
        label: "Inline Expansion",
        title: "Full trip detail without leaving the board",
        body: [
          "The previous design required navigating away to see flight legs, crew, and pay. Pilots lost their scroll position every time. Every navigation felt like a potential dead end — directly worsening the anxiety seen in research.",
          "The redesigned board expands trips inline, directly below the row. Full duty timeline, crew manifest with seniority numbers, passenger count, and layover details — all in place. Board state preserved.",
        ],
        impact: "Evaluate and compare trips sequentially without losing board state. Look without touching — addressing the core fear of irreversible actions.",
        flip: true,
        image: "/images/trips tab expanded showing crew.png",
        imageCaption: "Trip V5031: Duty legs, crew manifest with CA/FO/FM/FA positions, open slots, block times — all without leaving the board.",
        imageUrl: "Trade Board — V5031 expanded inline",
      },
      {
        number: "03",
        label: "Deadhead Clarity",
        title: "The 18-month complaint fixed in one sprint",
        body: [
          "Deadhead (DH) flights are positioning legs — the pilot rides as a passenger. Confusing a DH leg with an operating one has real consequences: misunderstood workload, pay miscalculations, and scheduling errors hard to undo.",
          "The complaint had sat in the backlog for 18 months. The fix: a persistent, high-contrast DH badge on every deadheading crew member, impossible to miss regardless of scan speed.",
        ],
        impact: "DH-related confusion dropped sharply post-launch. An 18-month backlog item resolved in one sprint with a precisely targeted intervention.",
        image: "/images/inspecting a trip fromc ategory summary.png",
        imageCaption: "Crew tab: DH badges on crew members — immediately distinguishable from operating crew.",
        imageUrl: "Category Summary — V5368 crew tab",
      },
      {
        number: "04",
        label: "Bid-Period Context",
        title: "See the whole month before you commit to a trade",
        body: [
          "The list-only Trade Board was efficient for individual trip evaluation but blind to the full bid-period picture. Pilots made trade decisions without knowing how they'd affect the month — sometimes discovering conflicts only after submitting.",
          "The Category Summary tab adds a Gantt-style view across the full bid period. Open trips float at the top. The pay footer shows live BLK, TAFB, and LPV totals — updating in real time.",
        ],
        impact: "Pilots answer \"does this trade work for my month?\" in seconds. Live pay footer. Open trips always visible at the top without scrolling.",
        flip: true,
        image: "/images/category summary.png",
        imageCaption: "Gantt view: Full bid period. BLK 50:22 · TAFB 163:32 · LPV $35,919 — all live.",
        imageUrl: "Category Summary — March bid period",
      },
      {
        number: "05",
        label: "Design Systems",
        title: "One component. Consistent everywhere.",
        body: [
          "The Customize Trip Info modal needed to work across three contexts: Trade Board, Category Summary, and Open Trip Alerts. Rather than designing each separately — creating three different mental models — I designed one configurable component.",
          "Desktop, Tablet, and Mobile tabs for per-device configuration. Required columns locked. Optional columns freely reorderable via drag-and-drop. Live preview always visible. Same modal, same behavior, everywhere.",
        ],
        impact: "One decision propagated consistently across the entire product. Reduced engineering rework. Pilots learn one system no matter which view they encounter it in.",
        image: "/images/modal-new.png",
        imageCaption: "One component: Desktop/Tablet/Mobile tabs. Live preview. 22 configurable fields. Required fields locked. Drag-and-drop reordering.",
      },
    ],
    constraints: [
      { title: "Established Design System", body: "Built on United's internal component library — every new pattern needed alignment with existing conventions used across 12+ applications." },
      { title: "Complex Business Rules", body: "Trip legality involves FAA rest requirements, union contract rules, equipment qualifications, and seniority hierarchies — all enforced in real-time." },
      { title: "Compressed Timeline", body: "Major features shipped in 2-week sprints with stakeholder demos every cycle. No room for extended exploration phases." },
      { title: "Zero Downtime Tolerance", body: "10,000+ pilots depend on CCS+ daily. Every release had to be backwards-compatible and deployable without service interruption." },
    ],
    impact: [
      { value: "10k", suffix: "+", label: "Active pilots using CCS+ daily" },
      { value: "~65", suffix: "%", label: "Reduction in trip evaluation time", caveat: "Estimated from pilot feedback sessions" },
      { value: "18", suffix: "mo", label: "Backlog complaint resolved in 1 sprint" },
      { value: "217", label: "Trips per session, all scannable" },
    ],
    beforeAfter: [
      {
        label: "Pilot Pool Display",
        desc: "Pool visibility integrated directly into the Trade Board — no context switch, no separate app, no navigation away.",
        beforeImage: "/images/pool-display-old.png",
        beforeAlt: "Legacy pool display — static monthly calendar grid with raw reserve counts",
        beforeLabel: "Before — Crew Communication System",
        beforeCaption: "Legacy: Static monthly calendar grid showing raw reserve counts. No trip visualization, no pay data, no sorting.",
        afterImage: "/images/trips tab.png",
        afterAlt: "CCS+ Trade Board — 217 trips scannable in one view",
        afterLabel: "After — CCS+ Trade Board",
        afterCaption: "CCS+: Pool visibility integrated inline. Block, TAFB, pay, layovers per row. RT/DH badges. 217 trips — all scannable.",
        afterUrl: "ccsplus.ual.com / trade-center / trips",
        deltaBefore: [
          { type: "bad", text: "Calendar grid — zero trip visualization" },
          { type: "bad", text: "No pay data without navigating away" },
          { type: "bad", text: "No sorting or filtering available" },
        ],
        deltaAfter: [
          { type: "good", text: "Pool visibility in the Trade Board — no context switch" },
          { type: "good", text: "Block, TAFB, pay, layovers visible per row" },
          { type: "good", text: "RT and DH badges instantly signal trip type" },
        ],
      },
      {
        label: "Trip Customization",
        desc: "Pilots typed pixel widths with zero visual feedback. Redesigned with a live preview, drag-and-drop, and per-device breakpoint tabs in one reusable component.",
        beforeImage: "/images/modal-old.png",
        beforeAlt: "Legacy customize modal — static checkbox list with manual pixel-width inputs",
        beforeLabel: "Before — Crew Companion",
        beforeCaption: "Legacy: Static checkbox list with manual pixel-width inputs. No live preview, no drag-and-drop, no multi-device support.",
        afterImage: "/images/modal-new.png",
        afterAlt: "CCS+ Customize Trip Info — live preview, device tabs, drag-and-drop reordering",
        afterLabel: "After — CCS+ Customize Trip Info",
        afterCaption: "CCS+: Live preview, Desktop/Tablet/Mobile tabs, drag-and-drop reordering, required fields locked. One component, used everywhere.",
        deltaBefore: [
          { type: "bad", text: "Manual pixel inputs — completely blind configuration" },
          { type: "bad", text: "No live preview — save and refresh to see result" },
          { type: "bad", text: "Single layout for all devices" },
        ],
        deltaAfter: [
          { type: "good", text: "Live trip bar preview updates as you configure" },
          { type: "good", text: "Desktop / Tablet / Mobile breakpoint tabs" },
          { type: "good", text: "Drag-and-drop with numbered positions" },
        ],
      },
      {
        label: "Reserves Available (RAD)",
        desc: "Redesigned into date-grouped, collapsible sections with reserve type sub-groups and dropdown filters. Consistent with the CCS+ table system everywhere.",
        beforeImage: "/images/rad-old.png",
        beforeAlt: "Legacy RAD — flat ungrouped data table with manual date input",
        beforeLabel: "Before — Legacy RAD",
        beforeCaption: "Legacy: Flat, ungrouped data table. No date grouping, no collapsible sections. Manual ddmmyy text input as the only filter.",
        afterImage: "/images/rad-new.png",
        afterAlt: "CCS+ Reserves Available — date-grouped collapsible sections with dropdown filters",
        afterLabel: "After — CCS+ Reserves Available",
        afterCaption: "CCS+: Date-grouped collapsible sections with reserve type sub-groups (LSR, SC, FSB), dropdown filters, consistent with CCS+ table system.",
        afterUrl: "ccsplus.ual.com / trade-center / reserves-available",
        deltaBefore: [
          { type: "bad", text: "Flat ungrouped rows — no date organization" },
          { type: "bad", text: "Manual ddmmyy text input only" },
          { type: "bad", text: "Visually disconnected from CCS+" },
        ],
        deltaAfter: [
          { type: "good", text: "Date-grouped, collapsible sections" },
          { type: "good", text: "Dropdown filters with multi-field search" },
          { type: "good", text: "Consistent with CCS+ design system" },
        ],
      },
    ],
  },
  {
    slug: "design-system-migration",
    title: "Design System Migration",
    subtitle: "At Borouge International: fixing broken libraries and token drift across seven product teams",
    client: "Borouge International",
    year: "2026",
    role: "UI/UX Engineer",
    platform: "Figma Libraries · Web App",
    users: "7 product squads",
    duration: "14 weeks",
    impactHeadline: "82% fewer token mismatches",
    tags: ["Design Systems", "Figma", "Migration", "Tokens", "Enterprise"],
    accentColor: "#1A7DD4",
    accentDark: "#0C2B4D",
    heroScreenUrl: "/images/blog/figma-mcp-claude/figma-copy-link.png",
    heroScreenCaption: "Borouge design system migration - source frame linking and handoff standardization",
    previewImage: "/images/blog/figma-mcp-claude/chrome-final-product.png",
    lede: "At Borouge International, I led a design system migration to fix token drift, broken component links, and inconsistent handoff across seven product squads.",
    contextTail: "It affected every release.",
    researchTail: "It was accumulated design debt.",
    sections: [
      {
        id: "context",
        label: "Context",
        number: "01",
        title: "One design org.",
        titleAccent: "Seven different libraries.",
        body: [
          "Each squad had drifted into its own library conventions, with duplicated components and inconsistent variable naming.",
          "My job was to scope, sequence, and execute a migration to one trusted source of truth without slowing product delivery.",
        ],
        quote: {
          text: "Reviews looked fine, but implementation kept drifting because token links and library usage were inconsistent.",
          cite: "Design system manager, migration kickoff",
        },
      },
      {
        id: "research",
        label: "Research & Discovery",
        number: "02",
        title: "The issue wasn't",
        titleAccent: "design quality.",
        body: [
          "I audited release defects, component usage, and variable collections. The root issues were structural: alias breaks, detached instances, and inconsistent library publishing.",
          "I grouped risk into token integrity, component linkage, and publishing discipline before rollout.",
        ],
      },
      {
        id: "process",
        label: "Design Process",
        number: "04",
        title: "A phased migration,",
        titleAccent: "not a big-bang rewrite.",
        body: [
          "I ran four phases: audit, target model, pilot, and team-by-team rollout with release gates.",
        ],
      },
      {
        id: "decisions",
        label: "Key Design Decisions",
        number: "05",
        title: "Three decisions that",
        titleAccent: "kept rollout stable.",
        body: [
          "These decisions kept rollout stable while teams continued sprint delivery.",
        ],
      },
      {
        id: "constraints",
        label: "Constraints",
        number: "06",
        title: "A migration under",
        titleAccent: "real delivery pressure.",
        body: [
          "Migration happened alongside active roadmap work, so adoption had to be incremental and low-risk.",
        ],
      },
    ],
    stats: [
      { value: "420", description: "Components audited across legacy libraries", barColor: "#1A7DD4" },
      { value: "82", suffix: "%", description: "Fewer token mismatch defects after rollout", caveat: "Based on QA logs from the first 6 post-migration weeks", barColor: "#2D9C5A" },
      { value: "6", suffix: "d", description: "Average handoff cycle time (down from 11 days)", barColor: "#E8A020" },
      { value: "0", description: "Critical migration regressions after final rollout", barColor: "#D94F4F" },
    ],
    insights: [
      {
        number: "01",
        title: "Token aliases were fragile",
        body: "Alias chains were inconsistent, so small variable updates caused silent semantic breaks.",
        quote: "We had multiple names for the same color, and none of them were dependable.",
      },
      {
        number: "02",
        title: "Component detachment was normalized",
        body: "Detached instances were copied into new work, spreading drift with each sprint.",
        quote: "Detaching was faster in the moment, but it cost us later.",
      },
      {
        number: "03",
        title: "Publishing lacked governance",
        body: "Library updates lacked consistent checks, so some teams over-accepted changes while others avoided updates.",
        quote: "People avoided update prompts because they did not trust what would break.",
      },
    ],
    tabs: [
      {
        id: "problem",
        title: "We were shipping from too many sources of truth",
        body: "Seven squads worked from different libraries, causing repeated spacing, typography, and color mismatches.",
        image: "/images/blog/figma-mcp-claude/figma-copy-link.png",
        alt: "Figma frame-link workflow before standardization",
        captionTitle: "Broken flow",
        captionBody: "Before migration, teams passed specs manually from frame links without a consistent QA layer.",
      },
      {
        id: "solution",
        title: "One token model, one library workflow",
        body: "I standardized variable collections, cleaned semantic aliases, and added a repeatable MCP-assisted parity check before handoff.",
        image: "/images/blog/figma-mcp-claude/ide-paste-link.png",
        alt: "MCP-assisted prompt workflow used in the new review process",
        captionTitle: "Assisted validation",
        captionBody: "MCP-assisted checks reduced manual parity verification and caught token drift earlier.",
        imageUrl: "mcp / get_figma_data / token-audit",
      },
      {
        id: "challenge",
        title: "We could not pause delivery to migrate",
        body: "We ran dual publishing, piloted with two squads, and then migrated team by team without freezing delivery.",
        image: "/images/blog/figma-mcp-claude/chrome-final-product.png",
        alt: "Post-migration UI used as acceptance benchmark during phased rollout",
        captionTitle: "Execution model",
        captionBody: "Teams kept shipping while rollout progressed in controlled waves with explicit release gates.",
      },
      {
        id: "summary",
        title: "The system became predictable again",
        body: "After migration, ownership was clear, token usage stabilized, and QA surprises dropped.",
        image: "/images/blog/figma-mcp-claude/chrome-final-product.png",
        alt: "Final implemented UI aligned with system specifications",
        captionTitle: "Outcome",
        captionBody: "Implementation parity improved because teams were finally using the same system conventions.",
        imageUrl: "final-ui / post-migration / release",
      },
    ],
    process: [
      {
        number: "01",
        title: "Migration Audit and Risk Scoring",
        body: "Mapped components, variables, and dependencies, then prioritized by breakage risk.",
      },
      {
        number: "02",
        title: "Target Architecture and Naming Governance",
        body: "Defined shared variable collections, alias rules, and naming standards for design and engineering.",
      },
      {
        number: "03",
        title: "Pilot Rollout with Two Product Squads",
        body: "Piloted with two squads first, measured friction and defects, then scaled.",
      },
      {
        number: "04",
        title: "Scaled Adoption and Deprecation",
        body: "Rolled out in waves with deprecation notes and update checklists.",
      },
    ],
    decisions: [
      {
        number: "01",
        label: "Inventory First",
        title: "No migration before dependency mapping",
        body: [
          "I paused conversion work until dependencies were mapped. That prevented hidden breakpoints from showing up late in rollout.",
          "The inventory called out orphaned tokens, duplicate semantic names, detached components, and unowned library assets.",
        ],
        impact: "Better visibility up front reduced rollback risk and made effort estimates more realistic.",
        image: "/images/blog/figma-mcp-claude/figma-copy-link.png",
        imageCaption: "Audit phase: tracing components and tokens back to exact source frames.",
      },
      {
        number: "02",
        label: "Token Governance",
        title: "Semantic aliases over raw value references",
        body: [
          "I moved teams away from raw value references and into semantic aliases.",
          "Each semantic token had an owner and a plain-language usage description.",
        ],
        impact: "Token drift dropped and updates became safer because source changes no longer broke meaning.",
        flip: true,
      },
      {
        number: "03",
        label: "Automation for QA",
        title: "Use MCP for repetitive checks, not design decisions",
        body: [
          "I added an MCP-assisted review step to extract frame-level values and run quick parity checks for spacing, color, and typography.",
          "Final sign-off stayed with design and engineering. The automation helped us catch outliers earlier.",
        ],
        impact: "QA cycles got faster and fewer mismatches escaped into handoff files.",
      },
    ],
    constraints: [
      { title: "Parallel Delivery", body: "Feature squads had active sprint commitments. Migration work could not block roadmap delivery." },
      { title: "Cross-Team Variance", body: "Teams had different library habits, naming conventions, and tolerance for process change." },
      { title: "Tooling Complexity", body: "Legacy styles, local variables, and detached instances required careful sequence planning." },
      { title: "Governance Adoption", body: "Sustainable migration depended on behavior change, not just technical cleanup." },
    ],
    impact: [
      { value: "82", suffix: "%", label: "Reduction in token mismatch defects" },
      { value: "6", suffix: "d", label: "Average handoff cycle time after migration" },
      { value: "7", label: "Product squads migrated to one system" },
      { value: "0", label: "Critical regressions after final wave" },
    ],
    beforeAfter: [],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
