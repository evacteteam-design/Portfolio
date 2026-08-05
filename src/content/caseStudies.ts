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

export type StudyTabId = "problem" | "solution" | "challenge" | "summary" | "system-fluency" | "pattern-discipline" | "governance" | "outcome";

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
    title: "Lightning Design System",
    subtitle: "A 2-hour rapid prototype demonstrating SLDS fluency: a fully interactive DMV ticket-processing console built with real Salesforce components and live workflow logic",
    client: "Rapid Prototyping Demonstration",
    year: "2026",
    role: "Product Designer",
    platform: "React · SLDS · Next.js · Live prototype",
    users: "DMV counter agents, supervisors, and operations staff",
    duration: "2 hours",
    impactHeadline: "Fully interactive SLDS prototype with real queue logic, modals, workflow steps, and responsive layout",
    tags: ["Salesforce SLDS", "Design Systems", "Accessibility", "Enterprise UX", "Prototyping"],
    accentColor: "#0176D3",
    accentDark: "#0A2644",
    heroScreenUrl: "/images/design-system-migration/demo-overview.png",
    heroScreenCaption: "Live DMV ticket-processing console built in a single session using SLDS React components and real stateful workflow logic",
    previewImage: "/images/design-system-migration/demo-overview.png",
    lede: "This is a 2-hour rapid prototype, not a months-long project. The goal was to demonstrate SLDS fluency end-to-end: pick a real domain, build a working console using actual Salesforce Lightning components, wire up live state and workflow logic, and ship it. The result is a fully interactive DMV ticket-processing system that runs in the browser.",
    contextTail: "A DMV ticket console — complex enough to be real.",
    researchTail: "Queue logic. Case states. Live modals. All wired up.",
    sections: [
      {
        id: "context",
        label: "Context",
        number: "01",
        title: "Two hours. One brief:",
        titleAccent: "prove SLDS fluency end-to-end.",
        body: [
          "The challenge was simple: pick a real-world enterprise domain, build a fully interactive console using Salesforce Lightning Design System React components, wire up genuine workflow logic, and ship it. No Figma mockups. No placeholder data. No fake interactions.",
          "I chose a DMV ticket-processing workflow because it has exactly the complexity enterprise tools need to handle: queues, case states, document tracking, exception handling, and supervisor escalation — all in one view.",
        ],
        quote: {
          text: "I wanted to prove that SLDS fluency is not just about visual polish — it is about building something that actually works.",
          cite: "Akhil Vanga, on the prototype brief",
        },
      },
      {
        id: "research",
        label: "What was built",
        number: "02",
        title: "Queue management, case verification,",
        titleAccent: "supervisor review — all live.",
        body: [
          "The demo is a stateful React application using real SLDS components: PageHeader, Card, DataTable, Modal, ProgressBar, Checkbox, RadioGroup, Breadcrumb, and Badge — all from the @salesforce/design-system-react package with the official SLDS stylesheet.",
          "Ticket data is live in state. Queue pagination is real. Workflow step indicators update dynamically based on what the agent has checked. Missing documents block step progression. Supervisor and reschedule modals open with live ticket context. The entire flow mirrors how an actual DMV operations console would behave.",
        ],
      },
      {
        id: "process",
        label: "Design Process",
        number: "04",
        title: "Designed and built",
        titleAccent: "in a single session.",
        body: [
          "I started with information architecture: what does a counter agent need to see at a glance, and what needs to be one level deeper? From there I designed the layout in code using SLDS grid utilities and component composition — no external mockup tool.",
          "Every iteration was live in the browser. I worked through hierarchy, spacing, card grouping, step indicators, responsive breakpoints, and mobile alignment iteratively, validating in real time.",
        ],
      },
      {
        id: "decisions",
        label: "Key Design Decisions",
        number: "05",
        title: "Every decision had",
        titleAccent: "a real reason.",
        body: [
          "The step-by-step workflow panel shows dynamic status badges per step — Done, In progress, Missing docs, Pending — tied directly to document state and confirmation checkboxes. This was a deliberate choice to make the agent's current position in the workflow immediately legible.",
          "The case history panel uses a label/value metadata grid rather than a flat list of paragraphs, because information hierarchy is the difference between a tool people trust and one they avoid.",
        ],
      },
      {
        id: "constraints",
        label: "Constraints",
        number: "06",
        title: "Self-imposed rules that",
        titleAccent: "kept the work honest.",
        body: [
          "No external images. No placeholder components. No bypassing SLDS rules. Every component had to be a real SLDS React component used correctly. Spacing had to follow 8px rhythm. Colors had to be SLDS semantic tokens. If SLDS does not support it natively, it had to be built with plain CSS scoped to the demo shell.",
        ],
      },
    ],
    stats: [
      { value: "2", suffix: "h", description: "Time from blank file to live, responsive, interactive prototype", barColor: "#0176D3" },
      { value: "10", suffix: "+", description: "SLDS React components used: Modal, DataTable, Card, ProgressBar, Badge and more", barColor: "#2D9C5A" },
      { value: "3", description: "Live workflow views: queue management, case processing, and supervisor review", barColor: "#E8A020" },
      { value: "0", description: "Figma frames used — designed and built entirely in code in the browser", barColor: "#D94F4F" },
    ],
    insights: [
      {
        number: "01",
        title: "SLDS fluency means using components correctly, not just visually",
        body: "Using the right component variant, the right semantic token, and the right spacing class is what separates an SLDS implementation from a rough approximation of one.",
        quote: "It is easy to make something look like SLDS. It is harder to make it behave like SLDS.",
      },
      {
        number: "02",
        title: "Real logic makes the design problem real",
        body: "Wiring up actual state transitions — missing documents blocking step 2, confirmations unlocking compliance, queue pagination with live row switching — forced design decisions that a static mockup would have let me avoid.",
        quote: "Prototypes that actually work reveal problems that wireframes never will.",
      },
      {
        number: "03",
        title: "Information hierarchy is the most important decision in enterprise UI",
        body: "In a case-processing console, the difference between a tool agents use confidently and one they ignore is how fast they can find what matters. Hierarchy is not aesthetic — it is functional.",
        quote: "Structure is not decoration. It is the product.",
      },
    ],
    tabs: [
      {
        id: "system-fluency",
        title: "I can work inside a system without losing product judgment",
        body: "This example shows how I interpret a design system, understand its intent, and apply it in a way that still feels appropriate for the product and the user.",
        image: "/images/design-system-migration/demo-overview.png",
        alt: "Live overview of the SLDS-driven DMV workflow console",
        captionTitle: "System fluency",
        captionBody: "The system structure translates directly into a working case-processing layout with clear hierarchy.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        id: "pattern-discipline",
        title: "I think in reusable patterns, not isolated screens",
        body: "The record layout, modal experience, and supporting panels are designed as a coherent system of interactions that can scale across more than one workflow.",
        image: "/images/design-system-migration/demo-queue-modal-focus.png",
        alt: "Queue modal state showing reusable modal shell and queue controls",
        captionTitle: "Pattern discipline",
        captionBody: "Queue switching uses the same reusable modal structure, footer actions, and data-table conventions.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        id: "governance",
        title: "I care about consistency, accessibility, and implementation readiness",
        body: "A good design system is not only visually coherent. It must support real product delivery through accessible patterns, clear hierarchy, and dependable interaction behavior.",
        image: "/images/design-system-migration/demo-process-actions-state.png",
        alt: "Process panel showing badge state, progress bars, and primary action consistency",
        captionTitle: "Governance mindset",
        captionBody: "Badge states, progress labels, and action hierarchy stay consistent under real workflow conditions.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        id: "outcome",
        title: "The outcome is a product experience that feels professional and scalable",
        body: "The final work demonstrates how I can use a design system to create an experience that is structured, meaningful, and ready for enterprise use.",
        image: "/images/design-system-migration/demo-supervisor-modal-focus.png",
        alt: "Supervisor review modal integrated into the same case-processing flow",
        captionTitle: "Outcome",
        captionBody: "Review and exception flows are integrated without breaking context, which is critical for enterprise task continuity.",
        imageUrl: "/work/design-system-migration/demo",
      },
    ],
    process: [
      {
        number: "01",
        title: "Information Architecture First",
        body: "I mapped the DMV counter agent's core tasks: serve a ticket, verify documents, handle exceptions, escalate if needed. That drove the layout hierarchy before any component was chosen.",
      },
      {
        number: "02",
        title: "Live SLDS Component Assembly",
        body: "I built the page structure using PageHeader, Card, and SLDS grid utilities, then layered in DataTable for the queue, ProgressBar for workflow tracking, and Modal for queue switching and supervisor review.",
      },
      {
        number: "03",
        title: "Stateful Workflow Logic",
        body: "I wired up real React state: ticket selection, document verification progression, step badge logic, modal open/close with live ticket context, and queue pagination with active row tracking.",
      },
      {
        number: "04",
        title: "Responsive and Visual Polish",
        body: "I iterated on spacing, typography, mobile breakpoints, badge hierarchy, and interaction clarity in the browser until the console felt like real enterprise software across all screen sizes.",
      },
    ],
    decisions: [
      {
        number: "01",
        label: "Layout & Hierarchy",
        title: "Structure before components",
        body: [
          "Before choosing a single SLDS component, I mapped the information hierarchy. What does the agent need at the top level? What can be one click deeper?",
          "That decision determined the two-column layout, the KPI tile bar at the top, and the split between the process panel and the case history panel.",
        ],
        impact: "The hierarchy makes the console scannable in under three seconds — critical for time-pressured counter agents.",
        image: "/images/design-system-migration/demo-overview.png",
        imageCaption: "Live case overview: information hierarchy, KPI tiles, and action routing aligned to SLDS patterns.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        number: "02",
        label: "Workflow Logic",
        title: "Dynamic step indicators tied to real state",
        body: [
          "Each step in the workflow panel shows a live badge: Done, In progress, Missing docs, or Pending — driven by actual checkbox state and document verification count, not hardcoded values.",
          "This forced me to think about the exact completion condition for each step and make them visible to the agent without adding cognitive load.",
        ],
        impact: "Agents know exactly where they are in the workflow without reading instructions or switching screens.",
        flip: true,
        image: "/images/design-system-migration/demo-queue-modal-focus.png",
        imageCaption: "Queue modal: reusable container, consistent action grouping, and data-table interaction in one repeatable pattern.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        number: "03",
        label: "Case History Panel",
        title: "Label/value grid over flat paragraph list",
        body: [
          "The original case history card was a flat list of paragraphs. It was impossible to scan. I replaced it with a structured metadata grid where labels and values are in clear columns with separator lines.",
          "A small change in information format had a large impact on how fast a counter agent can confirm customer identity, visit history, and document status.",
        ],
        impact: "The panel now reads like a structured record, not a block of text — which is exactly what enterprise tools need.",
        image: "/images/design-system-migration/demo-supervisor-modal-focus.png",
        imageCaption: "Supervisor review modal: form readability, control spacing, and clear submit/cancel actions under modal constraints.",
        imageUrl: "/work/design-system-migration/demo",
      },
    ],
    constraints: [
      { title: "Real SLDS only", body: "Every component had to be from the @salesforce/design-system-react package. No custom component wrappers pretending to be SLDS." },
      { title: "Live state, no mocks", body: "All ticket data, queue state, document verification progress, and modal context had to be real React state — no hardcoded UI illusions." },
      { title: "8px spacing rhythm", body: "All spacing had to follow SLDS utility class increments. No arbitrary pixel values outside the system." },
      { title: "Responsive from day one", body: "The layout had to work on mobile, iPad, and desktop without breaking component behavior or creating horizontal overflow." },
    ],
    impact: [
      { value: "2", suffix: "h", label: "Total time to build a fully interactive, responsive SLDS console from scratch" },
      { value: "10", suffix: "+", label: "Real SLDS React components wired with live state and real workflow logic" },
      { value: "3", label: "Working modals: queue switcher, reschedule case, and supervisor review" },
      { value: "0", label: "Static mockups — every interaction works in the browser right now" },
    ],
    beforeAfter: [],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
