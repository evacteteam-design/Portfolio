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

export type StudyTabId = "problem" | "solution" | "challenge" | "summary" | "system-fluency" | "pattern-discipline" | "governance" | "outcome" | "queue" | "journey" | "documents" | "payment" | "completed" | "mobile";

export interface StudyTab {
  id: StudyTabId;
  title: string;
  body: string;
  image: string;
  imageAspectRatio?: string;
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
  imageAlt?: string;
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
    slug: "axiom-ci",
    title: "Axiom CI",
    subtitle: "AI-assisted contract intelligence for trustworthy commercial review and recovery",
    client: "Enterprise procurement workflow",
    year: "2025",
    role: "Lead Product Designer",
    platform: "Enterprise web application",
    users: "Procurement · Accounts Payable · finance teams",
    duration: "6 weeks",
    impactHeadline: "A trust-first AI workflow that turns variance into a clear, accountable action",
    tags: ["AI UX", "Contract Intelligence", "Procurement", "Enterprise Workflow", "Recovery Ops"],
    accentColor: "#56B7F8",
    accentDark: "#061A2E",
    heroScreenUrl: "/images/axiom-ci-case-study/Screenshot 2026-09-14 104638.png",
    heroScreenCaption: "Axiom CI / contract actions / pending review queue",
    previewImage: "/images/axiom-ci-case-study/Screenshot 2026-09-14 104638.png",
    lede: "Axiom CI helps teams spot invoice and contract variance earlier, but the real product challenge was making that signal trustworthy. Reviewers need to understand why a finding matters, what evidence supports it, and what decision should happen next — without turning everyday operations into a data-analysis task.",
    contextTail: "A commercial intelligence workflow — dense enough to be real, clear enough to review.",
    researchTail: "Evidence. Confidence. Accountability. Recovery.",
    sections: [
      {
        id: "context",
        label: "Context",
        number: "01",
        title: "Contracts contain the truth.",
        titleAccent: "Invoices contain the spend.",
        body: [
          "Procurement and finance teams work across contracts, amendments, master agreements, invoice lines, SAP data, and supplier activity. The challenge was not just to find variance — it was to make that finding <strong>reviewable, explainable, and actionable</strong> inside a workflow people could trust.",
          "Axiom CI was designed to surface supplier Deviations in a single operating model without reducing review to blind automation. The product had to show not only the finding, but the reason behind it, the evidence supporting it, and whose decision it was to act next.",
          "The experience needed to work for both strategic reviews and operational exceptions. One system had to explain a supplier relationship issue, a contract mismatch, an invoice irregularity, and the recovery path — without hiding the human judgment behind the final decision.",
        ],
        quote: {
          text: "The product could not stop at model-generated findings. It had to show what mattered, why it mattered, and what action completed the loop.",
          cite: "Axiom CI design brief",
        },
      },
      {
        id: "research",
        label: "Research & Discovery",
        number: "02",
        title: "The real problem was",
        titleAccent: "not detection — it was trust.",
        body: [
          "The biggest usability issue was not that teams missed exceptions. It was that they couldn't quickly determine <strong>which exceptions were real, which were low confidence, and which required a relationship review versus an invoice line review</strong>.",
          "Across operational reviews, procurement teams described a fragmented experience: one queue for supplier relationship actions, another queue for invoice variations, and no shared model for how a finding moved from AI suggestion to validated decision.",
          "Design research made it clear that the interface needed to do more than summarize data. It needed to encode a decision flow: evidence first, action second, accountability always.",
        ],
      },
      {
        id: "process",
        label: "Design Process",
        number: "04",
        title: "Designing a value lifecycle",
        titleAccent: "not just a dashboard.",
        body: [
          "I started by mapping the work across the commercial lifecycle: supplier intake, contract context, mapping, invoice triage, deviation review, and recovery outcomes. The design challenge was to connect those stages in one coherent workflow without flattening their differences.",
          "Each stage was designed to carry a distinct type of decision, supported by a consistent visual language for confidence, evidence, status, and ownership. The result is a product that feels like a system rather than a collection of isolated screens.",
        ],
      },
      {
        id: "decisions",
        label: "Key Design Decisions",
        number: "05",
        title: "Five decisions that made the workflow understandable.",
        titleAccent: "and trustworthy.",
        body: [
          "Each decision was shaped by one goal: reduce ambiguity without hiding complexity. The product needed to help users act with confidence, not just consume more data.",
        ],
      },
      {
        id: "constraints",
        label: "Constraints",
        number: "06",
        title: "Designing inside real enterprise constraints.",
        titleAccent: "with operational consequences.",
        body: [
          "The system had to serve procurement, AP, and finance without creating a separate workflow for each. That meant supporting evidence-heavy review, layered document context, and cross-functional ownership in the same interface.",
          "The product also had to respect business risk: a low-confidence match, an unmatched SKU, or a missing contract reference could not be hidden behind a confident-looking automated result. The interface had to surface uncertainty before the decision was made.",
        ],
      },
    ],
    stats: [
      { value: "29", description: "pending contract and invoice actions surfaced in one queue", barColor: "#56B7F8" },
      { value: "6", description: "contract relationship actions separated from invoice review", barColor: "#8ACBFF" },
      { value: "23", description: "invoice actions organized into reviewable categories", barColor: "#7FD6C8" },
      { value: "1", description: "shared value lifecycle spanning commercial and finance teams", barColor: "#B9EAF8" },
    ],
    insights: [
      {
        number: "01",
        title: "Queue clarity improved review momentum",
        body: "The product organizes contract and invoice work into separate action streams, reducing cognitive collision between relationship decisions and invoice-level discrepancies.",
        quote: "Reviewers knew what kind of action they were taking before they opened a case.",
      },
      {
        number: "02",
        title: "Evidence needed to be visible at the decision point",
        body: "AI suggestions were useful only when the user could inspect the source document, rate sheet, dates, and contract metadata without leaving the decision surface.",
        quote: "The system had to explain itself without forcing users into detective work.",
      },
      {
        number: "03",
        title: "Recovery only works when review is transparent",
        body: "The value lifecycle is not just analytics. It is a proof chain — spend, variance, validation, recovery, and outcome all linked in one visible path.",
        quote: "A business can only recover value if the work is legible and accountable.",
      },
    ],
    process: [
      {
        number: "01",
        title: "Supplier intake & scope definition",
        body: "The review journey begins with a governed intake flow: invoice scope, document selection, historical versus new ingestion, and clear readiness indicators for the active supplier.",
      },
      {
        number: "02",
        title: "AI-assisted mapping & evidence review",
        body: "Alias suggestions and confidence scores surface invoice language mismatches alongside contract metadata so a reviewer can decide whether a match is trusted or rejected.",
      },
      {
        number: "03",
        title: "Contract context & lifecycle visibility",
        body: "The contract library shows document hierarchy, effective dates, OLA coverage, extraction confidence, and status — all in context with supplier relationship information.",
      },
      {
        number: "04",
        title: "Deviation review & recovery tracking",
        body: "The invoice detail view reconciles spend, expected totals, actual totals, and case action in a single review experience, making recovery status visible and defendable.",
      },
    ],
    decisions: [
      {
        number: "01",
        label: "Action Queue Separation",
        title: "Separate relationship actions from invoice actions",
        body: [
          "The key insight was that a contract relationship issue and an invoice exception are two different kinds of decision. Mixing them in one queue creates confusion and weakens accountability.",
          "By separating contract actions from invoice actions, the interface helps reviewers move through the right problem space without cross-contamination of decisions or state.",
        ],
        impact: "Teams can quickly tell whether they are addressing supplier-level contract health or invoice-level financial recovery without losing context.",
        image: "/images/axiom-ci-case-study/Screenshot 2026-09-14 104638.png",
        imageCaption: "Contract actions and invoice actions are each surfaced with distinct status, relationship, and action framing so review scope is obvious at a glance.",
        imageUrl: "Axiom CI / pending action queue",
      },
      {
        number: "02",
        label: "Guided Intake",
        title: "Turn ingestion into a controlled workflow",
        body: [
          "The supplier workspace strips away the ambiguity of bulk data intake. The three-step flow turns ingestion into a deliberate decision sequence: scope the document set, select the time frame, then execute the load.",
          "This reduces operational risk by making the system explain what is being pulled in and what is left out, rather than silently processing a broad set of documents.",
        ],
        impact: "The workflow helps teams know when they are ready to act, while also making the no-filter state feel intentional instead of dangerous.",
        flip: true,
        image: "/images/axiom-ci-case-study/Screenshot 2026-09-14 104745.png",
        imageCaption: "The supplier intake flow splits the task into controlled stages with explicit scope and status indicators to preserve operational confidence.",
        imageUrl: "Axiom CI / supplier workspace",
      },
      {
        number: "03",
        label: "Confidence & Traceability",
        title: "Make AI suggestions calibrated, not confident",
        body: [
          "The system uses confidence as a design signal rather than a hidden assumption. A match can be suggested without being accepted; a contract rate can be present without being definitive; a mismatch can remain visible as an unresolved result.",
          "This respects the realities of enterprise data quality and keeps the reviewer in charge of the final decision, while reducing the chance that the interface becomes a black box.",
        ],
        impact: "AI becomes a decision accelerator rather than a decision substitute, which is fundamental in commercial recovery workflows with real financial consequences.",
        image: "/images/axiom-ci-case-study/Screenshot 2026-09-14 104822.png",
        imageCaption: "Alias Builder and contract mapping show confidence, unmatched states, and change ownership so the suggestion remains reviewable and accountable.",
        imageUrl: "Axiom CI / alias builder",
      },
      {
        number: "04",
        label: "Invoice Detail Review",
        title: "Put evidence beside the line item decision",
        body: [
          "At invoice review, the design brings expected versus actual totals, Deviation, line item logic, and source document metadata into one visual decision surface. The reviewer can see the anomaly and the basis for it without jumping through multiple screens.",
          "This is where AI becomes operationally meaningful: the interface explains the variance while still letting a human validate and act on it.",
        ],
        impact: "The key review question — what is wrong, how do we know, and what is the next action? — is answered in a single place.",
        flip: true,
        image: "/images/axiom-ci-case-study/Screenshot 2026-09-14 105311.png",
        imageCaption: "The invoice detail view reveals the line-item math and the contract relationship side by side, making the decision path legible and auditable.",
        imageUrl: "Axiom CI / invoice line review",
      },
      {
        number: "05",
        label: "Language & Trust",
        title: "Use neutral language that keeps review honest",
        body: [
          "The product uses terms like Deviation and review-required to describe variance without pretending certainty. This language is important because it creates a more defensible operational conversation between procurement, AP, and supplier teams.",
          "Status legends and hover help decode the system at the moment of use, turning enterprise complexity into a teachable pattern instead of institutional knowledge.",
        ],
        impact: "The interface teaches itself in context, so trust grows through repeated use instead of training sessions or dense documentation.",
        image: "/images/axiom-ci-case-study/Screenshot 2026-09-14 105326.png",
        imageCaption: "The Invoice Legend and contextual help make status semantics visible, reducing confusion around workflow states and action categories.",
        imageUrl: "Axiom CI / status legend",
      },
    ],
    constraints: [
      { title: "Cross-functional operating model", body: "The workflow had to serve procurement, AP, finance, and supplier-facing recovery teams without creating different experiences for each discipline." },
      { title: "Evidence-heavy review", body: "A deviation had to be traceable to a contract, a rate sheet, or an invoice line, not just an algorithmic output or a raw summary metric." },
      { title: "Risk-aware AI interaction", body: "Low-confidence matches and unmatched fields had to remain visible and reviewable so teams never confused suggested intelligence with certainty." },
      { title: "Enterprise usability under complexity", body: "The interface needed to account for layered contract rules, supplier relationships, and invoice logic without becoming impossible to scan or navigate." },
    ],
    impact: [
      { value: "Clear", label: "decision paths" },
      { value: "Trusted", label: "AI-assisted review" },
      { value: "Actionable", label: "recovery workflow" },
      { value: "Unified", label: "commercial + finance view" },
    ],
    tabs: [
      {
        id: "problem",
        title: "The product had to turn variance into a workflow people trust.",
        body: "The core challenge was not finding exceptions. It was helping reviewers decide whether a variance was valid, supported by evidence, and safe to act on.",
        image: "/images/axiom-ci-case-study/Screenshot 2026-09-14 104707.png",
        alt: "Axiom CI invoice actions queue showing pending operational work",
        captionTitle: "Workflow clarity",
        captionBody: "Contract and invoice tasks are differentiated before review begins, which keeps the review logic honest and easier to navigate.",
        imageUrl: "Axiom CI / action queue",
      },
      {
        id: "solution",
        title: "Evidence-first actions create a strong operational rhythm.",
        body: "The platform pairs a review queue with contract context, invoice detail, and line-item evidence so every decision has a visible basis behind it.",
        image: "/images/axiom-ci-case-study/Screenshot 2026-09-14 105033.png",
        alt: "Axiom CI contract detail with evidence, extraction confidence, and source document in view",
        captionTitle: "Evidence-first review",
        captionBody: "The contract detail surface keeps the document and extracted logic in view to support a defensible action.",
        imageUrl: "Axiom CI / contract review",
      },
      {
        id: "challenge",
        title: "Complexity becomes manageable when the status model is explicit.",
        body: "Enterprise operations are full of edge cases. The design system needs to encode those rules in a way that remains visible, scannable, and safe for daily review.",
        image: "/images/axiom-ci-case-study/Screenshot 2026-09-14 105212.png",
        alt: "Axiom CI invoice list showing dates, amounts, contract links, and deviation state",
        captionTitle: "Status clarity",
        captionBody: "An invoice library makes the review state legible without forcing reviewers into a deep document-by-document search.",
        imageUrl: "Axiom CI / invoice triage",
      },
      {
        id: "summary",
        title: "The outcome is a value lifecycle the business can understand and trust.",
        body: "The experience closes the loop between detected variance, validated Deviation, supplier outreach, and recovery. That creates a system people can act on instead of just observe.",
        image: "/images/axiom-ci-case-study/Screenshot 2026-09-14 105351.png",
        alt: "Axiom CI insights and value lifecycle dashboard",
        captionTitle: "Recovery visibility",
        captionBody: "The insights dashboard shows the value journey from spend capture through recovery, giving the business a shared operating model.",
        imageUrl: "Axiom CI / insights",
      },
    ],
  },
  {
    slug: "design-system-migration",
    title: "DMV License Service Workflow",
    subtitle: "An assumption-based renewal and first-time application concept using Salesforce Lightning Design System components",
    client: "Self-directed concept",
    year: "2026",
    role: "Product design & prototyping",
    platform: "Salesforce SLDS React · Next.js",
    users: "Assumed DMV counter staff",
    duration: "Concept prototype",
    impactHeadline: "Illustrative four-step workflow",
    tags: ["Concept prototype", "Salesforce Lightning Design System", "Renewal & first-time application", "Staff workflow"],
    accentColor: "#0176D3",
    accentDark: "#0A2644",
    heroScreenUrl: "/images/design-system-migration/current-queue.png",
    heroScreenCaption: "Assumption-based DMV staff service flow",
    previewImage: "/images/design-system-migration/current-queue.png",
    lede: "This is a simple, assumption-based concept—not official DMV software or a research-validated service. It explores how staff might move from a ticket queue through renewal or first-time license steps using a clear, guided workspace.",
    contextTail: "Two assumed service paths, one staff workspace.",
    researchTail: "A concept—not official DMV guidance.",
    sections: [
      {
        id: "context",
        label: "Context",
        number: "01",
        title: "A DMV counter service",
        titleAccent: "scenario, not a validated brief.",
        body: [
          "This design exercise explores two assumed counter-service scenarios: renewing an expired driver's license and applying for a first license. It is not an official California DMV system and does not represent confirmed DMV policy.",
          "The prototype starts with a seeded ticket queue, then guides staff through identity and eligibility, document capture, screening, payment, and license issuance. The two paths share a workspace while presenting different illustrative document requirements.",
          "No DMV staff or customer research informed this scenario. The goal is to explore a clearer staff workflow—not to claim the flow is validated or production-ready.",
        ],
      },
      {
        id: "research",
        label: "Assumptions & scope",
        number: "02",
        title: "What the demo assumes",
        titleAccent: "and what it does not.",
        body: [
          "The workflow sequence, ticket data, eligibility details, document lists, and fees are illustrative placeholders. They are not confirmed California DMV requirements and should not be used as operational guidance.",
          "In this concept, uploading a scan represents the staff member confirming that they reviewed the document. The prototype does not authenticate documents, determine eligibility, or process a real payment.",
          "Uploaded files remain in browser memory while the page is open; there is no server storage or backend integration. Accessibility informed the design, but this prototype has not had a formal WCAG conformance audit or user testing.",
        ],
      },
      {
        id: "process",
        label: "Demo flow",
        number: "03",
        title: "A guided path from",
        titleAccent: "ticket to license.",
        body: [
          "The queue is the starting point. After staff call or resume a ticket, the prototype presents four sequential stages with a visible progress indicator. Renewal and first-time applications follow the same overall structure, with different illustrative document lists.",
        ],
      },
      {
        id: "decisions",
        label: "Design decisions",
        number: "04",
        title: "Make the next action",
        titleAccent: "clear at every step.",
        body: [
          "The design keeps staff oriented with a single queue, one active service path, explicit step progress, and a useful completed record. These are prototype design choices—not findings validated with DMV users.",
        ],
      },
      {
        id: "constraints",
        label: "Constraints",
        number: "05",
        title: "Keep the concept",
        titleAccent: "clear about its limits.",
        body: [
          "This is a front-end demonstration with seeded tickets and local React state. It has no DMV system connection, persistent records, real document verification, or payment processing.",
        ],
      },
    ],
    stats: [
      { value: "2", description: "Illustrative service paths: renewal and first-time application", barColor: "#0176D3" },
      { value: "4", description: "Guided stages after selecting a ticket", barColor: "#2D9C5A" },
      { value: "5", description: "Seeded sample tickets in the queue", barColor: "#E8A020" },
      { value: "0", description: "Backend integrations; prototype state stays in the browser", barColor: "#D94F4F" },
    ],
    insights: [
      {
        number: "01",
        title: "Start from a shared queue",
        body: "A single ticket list gives staff a clear starting point before they enter the details of a renewal or first-time application.",
      },
      {
        number: "02",
        title: "Keep progress visible",
        body: "A step indicator and clear next action help staff understand where they are and what remains in the current case.",
      },
      {
        number: "03",
        title: "Make the finished record useful",
        body: "A completed case remains available to review, including the uploaded files shown during the active browser session.",
      },
    ],
    tabs: [
      {
        id: "queue",
        title: "Start with the ticket queue",
        body: "Staff can call a waiting customer or resume a case. The queue shown here uses sample tickets created for this concept.",
        image: "/images/design-system-migration/current-queue.png",
        alt: "Current DMV staff demo showing the sample ticket queue",
        captionTitle: "Ticket queue",
        captionBody: "The queue is the entry point to both illustrative service paths.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        id: "journey",
        title: "Guide staff through the selected service",
        body: "The identity and eligibility screen establishes the active case before staff move on to document capture and screening.",
        image: "/images/design-system-migration/current-identity-step.png",
        alt: "Identity and eligibility step in the current license service demo",
        captionTitle: "Identity and eligibility",
        captionBody: "A visible progress indicator shows the current stage in the four-step case flow.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        id: "documents",
        title: "Treat scanning as part of staff review",
        body: "Uploading a scan marks that item reviewed in this concept, avoiding a redundant verification click. The prototype does not validate the document itself.",
        image: "/images/design-system-migration/current-document-review.png",
        alt: "Document capture step showing uploaded scans marked reviewed",
        captionTitle: "Document capture",
        captionBody: "Uploaded scans are treated as the staff member's review action in the prototype.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        id: "payment",
        title: "Make the final stage explicit",
        body: "The payment and license stage is represented for demonstration only. The sample fee and payment option are not official DMV amounts or payment processing.",
        image: "/images/design-system-migration/current-payment-step.png",
        alt: "Payment and license stage in the current license service demo",
        captionTitle: "Payment and license",
        captionBody: "An illustrative final stage with no real payment processing.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        id: "completed",
        title: "Keep completed cases available to review",
        body: "The finished record shows case details and the uploaded files for the current browser session. It is not saved to a DMV system.",
        image: "/images/design-system-migration/current-completed-record.png",
        alt: "Completed license case with its uploaded document records",
        captionTitle: "Completed record",
        captionBody: "Staff can reopen the case view and inspect the files retained during this session.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        id: "mobile",
        title: "Keep the queue usable on a small screen",
        body: "The queue adapts to a mobile viewport for this concept. Its layout has not been validated with DMV staff or customers.",
        image: "/images/design-system-migration/current-mobile-queue.png",
        imageAspectRatio: "390/844",
        alt: "Mobile-sized view of the sample DMV staff ticket queue",
        captionTitle: "Mobile queue",
        captionBody: "A narrow-screen view of the same sample queue.",
        imageUrl: "/work/design-system-migration/demo",
      },
    ],
    process: [
      {
        number: "01",
        title: "Select a ticket",
        body: "Staff call the next customer or resume a ticket from the sample queue, then continue into the chosen service path.",
      },
      {
        number: "02",
        title: "Check identity and eligibility",
        body: "The first guided stage captures the identity and eligibility checks represented in this illustrative flow.",
      },
      {
        number: "03",
        title: "Capture documents and screening",
        body: "Staff upload scans and record screening. Uploading marks a document reviewed in the prototype; it does not authenticate or validate the file.",
      },
      {
        number: "04",
        title: "Record payment and issue",
        body: "The final stage demonstrates a payment choice and license issuance, then leaves a completed record available to review.",
      },
    ],
    decisions: [
      {
        number: "01",
        label: "Queue first",
        title: "Give staff one place to start",
        body: [
          "The sample ticket queue appears before the case workflow so staff can call or resume a customer without first choosing from an abstract list of tasks.",
          "Renewal and first-time application are represented as service paths within the same staff workspace.",
        ],
        impact: "The concept makes the next starting action visible without suggesting that this queue matches an actual DMV operation.",
        image: "/images/design-system-migration/current-queue.png",
        imageAlt: "Sample ticket queue in the current DMV staff workflow demo",
        imageCaption: "Sample queue: a single starting point for the illustrative service flow.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        number: "02",
        label: "Guided progress",
        title: "Show the current step and next action",
        body: [
          "The four-step progress indicator remains visible as staff move from identity and eligibility through documents, screening, and payment.",
          "The next action is gated by the current step's completion state, keeping the sequence understandable in the demo.",
        ],
        impact: "Staff can see where the case is in the assumed sequence and what the current stage asks them to do.",
        flip: true,
        image: "/images/design-system-migration/current-screening-step.png",
        imageAlt: "Screening step with progress indicator and staff confirmation controls",
        imageCaption: "Screening: a visible step state before the payment stage.",
        imageUrl: "/work/design-system-migration/demo",
      },
      {
        number: "03",
        label: "Completed records",
        title: "Keep the finished case inspectable",
        body: [
          "The completed view includes the case summary and uploaded document records, with a way to view the files while the page remains open.",
          "Because this is a local prototype, the file objects are held only in browser memory and are not submitted or saved to a backend.",
        ],
        impact: "The case remains reviewable in the active session without implying that documents are durably stored.",
        image: "/images/design-system-migration/current-completed-record.png",
        imageAlt: "Completed case summary with uploaded document records",
        imageCaption: "Completed case: review the sample record and files in the active session.",
        imageUrl: "/work/design-system-migration/demo",
      },
    ],
    constraints: [
      { title: "Illustrative service rules", body: "The process, eligibility details, documents, fees, and sample tickets are assumptions—not official DMV policy or confirmed requirements." },
      { title: "Browser-only prototype", body: "There is no backend, persistent case history, server-side file storage, real document verification, or payment processing." },
      { title: "Use SLDS components where they fit", body: "The queue uses the SLDS React DataTable and Card components, with SLDS React Buttons for actions. The step tracker and case-specific workflow layout use custom markup and styling alongside the SLDS stylesheet." },
      { title: "Accessibility is not certification", body: "Accessibility informed the interaction and responsive design, but no formal WCAG audit or user testing has been completed." },
    ],
    impact: [
      { value: "2", label: "Assumed service paths: renewal and first-time application" },
      { value: "4", label: "Guided workflow stages in the demo" },
      { value: "5", label: "Seeded sample tickets shown in the queue" },
      { value: "0", label: "Backend integrations; no production impact has been measured" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
