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
    subtitle: "Designing an enterprise-ready Salesforce-style experience with SLDS principles, reusable patterns, and accessible interaction design",
    client: "Enterprise Product Design Case",
    year: "2026",
    role: "Senior UX/UI Product Designer",
    platform: "Figma · Web App Prototype",
    users: "Business analysts · service teams · enterprise operators",
    duration: "6 weeks",
    impactHeadline: "Reusable component system, clearer workflow, stronger enterprise UX",
    tags: ["Salesforce SLDS", "Design Systems", "Accessibility", "Enterprise UX", "Prototyping"],
    accentColor: "#0176D3",
    accentDark: "#0A2644",
    heroScreenUrl: "/images/design-system-migration/demo-overview.png",
    heroScreenCaption: "Live DMV case-processing console built with SLDS React patterns and real workflow states",
    previewImage: "/images/design-system-migration/demo-overview.png",
    lede: "This case study demonstrates how I approach enterprise design systems with the discipline of Salesforce Lightning Design System: scalable patterns, clear hierarchy, accessible interactions, and reusable components that can support complex operations without becoming cluttered.",
    contextTail: "It needed to feel trustworthy and efficient.",
    researchTail: "It was a systems problem, not just a screen problem.",
    sections: [
      {
        id: "context",
        label: "Context",
        number: "01",
        title: "Design systems are only valuable",
        titleAccent: "when they support meaning.",
        body: [
          "This work is less about a single feature and more about demonstrating how I adapt to a design system and turn it into a meaningful product experience. I used Salesforce Lightning principles as a framework to create a clear, scalable interface for a complex case-management workflow.",
          "The real value was not just the visual polish. It was showing that I can work fluently inside a system, apply its patterns responsibly, and still create a product experience that feels thoughtful, trustworthy, and usable for real work.",
        ],
        quote: {
          text: "The interface needed to feel like a trusted system, not a collection of disconnected screens.",
          cite: "Design principle from the case study framing",
        },
      },
      {
        id: "research",
        label: "Research & Discovery",
        number: "02",
        title: "My approach to any design system",
        titleAccent: "is systems thinking.",
        body: [
          "I treat design-system work as a combination of product judgment, interaction design, and implementation discipline. The goal is not to force a product into a system just because it exists. The goal is to understand the system deeply enough to use it meaningfully.",
          "That means translating business complexity into clear patterns, respecting component behavior, and making sure the experience still feels native to the product rather than generic or overly templated.",
        ],
      },
      {
        id: "process",
        label: "Design Process",
        number: "04",
        title: "A design-system method",
        titleAccent: "that scales.",
        body: [
          "I structured the work in three layers: information hierarchy, reusable pattern definition, and interaction clarity. That method lets me work effectively with both established systems and new product environments without losing the product’s intent.",
        ],
      },
      {
        id: "decisions",
        label: "Key Design Decisions",
        number: "05",
        title: "What this demonstrates",
        titleAccent: "about my working style.",
        body: [
          "This case shows how I bring design-system fluency into actual product work: I create structure, preserve consistency, and make complex workflows feel understandable. That is the difference between using a system as a library and using it as a product strategy.",
        ],
      },
      {
        id: "constraints",
        label: "Constraints",
        number: "06",
        title: "Why this matters",
        titleAccent: "in enterprise delivery.",
        body: [
          "Enterprise products need designers who can balance system consistency with product clarity. The challenge is not only to use the design system correctly, but to use it in a way that still supports user trust, speed, and confidence.",
        ],
      },
    ],
    stats: [
      { value: "3", description: "Core workflow views: overview, activity, and related records", barColor: "#0176D3" },
      { value: "1", description: "Reusable modal pattern for review and decision actions", barColor: "#2D9C5A" },
      { value: "100", suffix: "%", description: "Focused on clarity, consistency, and accessibility", barColor: "#E8A020" },
      { value: "∞", description: "Scalable design-system potential across enterprise apps", barColor: "#D94F4F" },
    ],
    insights: [
      {
        number: "01",
        title: "Consistency reduces cognitive load",
        body: "When enterprise users can predict where information will live, they make faster decisions and feel more confident in the system.",
        quote: "The best design systems feel invisible because the interaction model already makes sense.",
      },
      {
        number: "02",
        title: "Reusable patterns improve collaboration",
        body: "A shared modal, record scaffold, and action pattern make handoff simpler for design, product, and engineering teams.",
        quote: "Reusable patterns turn design systems into real delivery systems.",
      },
      {
        number: "03",
        title: "Accessibility is part of system quality",
        body: "Contrast, focus behavior, clear hierarchy, and structured content all matter equally in enterprise interfaces where users may operate under time pressure.",
        quote: "A system is only scalable when it works for every user, not just the happy path.",
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
        title: "System Framing and Workflow Mapping",
        body: "I defined the core information architecture and mapped the major user tasks before visual design began.",
      },
      {
        number: "02",
        title: "Reusable Component Definition",
        body: "I structured the page header, record summary, action grouping, and modal interaction as reusable system patterns.",
      },
      {
        number: "03",
        title: "High-Fidelity Prototype and Interaction Design",
        body: "I translated the pattern system into a polished prototype with strong hierarchy, accessible contrast, and clear state treatment.",
      },
      {
        number: "04",
        title: "Scalable Storytelling for Stakeholders",
        body: "I connected the component system to business outcomes so the work read as a strategic enterprise design solution, not just a UI mockup.",
      },
    ],
    decisions: [
      {
        number: "01",
        label: "System Clarity",
        title: "Structure first, then visual refinement",
        body: [
          "I began with a clear information hierarchy so users could understand the record context before they saw any visual polish.",
          "That made the final pattern feel deliberate rather than decorative.",
        ],
        impact: "The experience felt trustworthy because the structure was obvious from the first interaction.",
        image: "/images/design-system-migration/demo-overview.png",
        imageCaption: "Live case overview: information hierarchy, KPI tiles, and action routing aligned to SLDS patterns.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        number: "02",
        label: "Reusable Interaction Patterns",
        title: "One modal pattern, multiple useful contexts",
        body: [
          "I designed a modal experience that could support review, action, and related context without causing disruption to the main workflow.",
          "That is exactly the kind of pattern a design system needs if it is going to scale across teams.",
        ],
        impact: "The component feels familiar and reusable, which is essential for enterprise design-system adoption.",
        flip: true,
        image: "/images/design-system-migration/demo-queue-modal-focus.png",
        imageCaption: "Queue modal: reusable container, consistent action grouping, and data-table interaction in one repeatable pattern.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        number: "03",
        label: "Accessibility by Default",
        title: "Contrast, focus, and structure are system requirements",
        body: [
          "The interface uses clear contrast, visible states, and structured content so users can navigate confidently and complete work without ambiguity.",
          "That is especially important in enterprise roles where users are often operating under time pressure.",
        ],
        impact: "The design supports both usability and compliance, which strengthens its enterprise readiness.",
        image: "/images/design-system-migration/demo-supervisor-modal-focus.png",
        imageCaption: "Supervisor review modal: form readability, control spacing, and clear submit/cancel actions under modal constraints.",
        imageUrl: "/work/design-system-migration/demo",
      },
    ],
    constraints: [
      { title: "Operational Complexity", body: "The workflow needed to support dense information without becoming visually noisy or difficult to scan." },
      { title: "Enterprise Expectations", body: "The design had to feel polished, structured, and scalable enough for business-critical use." },
      { title: "Reusable System Thinking", body: "Every pattern needed to function beyond a single page so it could support future product growth." },
      { title: "Accessibility Standards", body: "The interaction system had to remain usable and understandable for all users, not just the primary audience." },
    ],
    impact: [
      { value: "3", label: "Core workflow views designed around one reusable pattern" },
      { value: "1", label: "Modal experience for review and action without context loss" },
      { value: "100", suffix: "%", label: "Design focus on clarity, consistency, and accessibility" },
      { value: "∞", label: "Scalable pattern potential across future enterprise products" },
    ],
    beforeAfter: [],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
