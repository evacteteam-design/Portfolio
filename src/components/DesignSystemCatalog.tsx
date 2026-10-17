"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  DataTable,
  DateField,
  DropdownMenu,
  EmptyState,
  FileDropzone,
  Grid,
  IconButton,
  Modal,
  Pagination,
  Progress,
  RadioGroup,
  RangeSlider,
  SelectField,
  Skeleton,
  Spinner,
  Stack,
  Switch,
  Tabs,
  TextArea,
  TextField,
  Toast,
  Tooltip,
  type ButtonVariant,
  type ComponentSize,
  type DataTableColumn,
} from "@akhil-vanga/design-system";

const sections = [
  { id: "foundations", label: "Foundations", icon: "◈" },
  { id: "actions", label: "Actions", icon: "↗" },
  { id: "forms", label: "Forms & inputs", icon: "▤" },
  { id: "feedback", label: "Feedback", icon: "◉" },
  { id: "overlays", label: "Overlays", icon: "▣" },
  { id: "navigation", label: "Navigation", icon: "⇥" },
  { id: "data", label: "Data display", icon: "▦" },
  { id: "layout", label: "Layout", icon: "⊞" },
];

const searchableComponents = [
  { name: "Button", section: "actions", terms: "button action primary secondary ghost danger sizes loading" },
  { name: "Badge", section: "actions", terms: "badge tag status chip" },
  { name: "Avatar", section: "actions", terms: "avatar profile image initials" },
  { name: "Icon button", section: "actions", terms: "icon only button action accessible label" },
  { name: "Text field", section: "forms", terms: "input text email password field label validation" },
  { name: "Text area", section: "forms", terms: "textarea multiline form" },
  { name: "Date field", section: "forms", terms: "date picker calendar date input" },
  { name: "Range slider", section: "forms", terms: "slider range volume control" },
  { name: "File dropzone", section: "forms", terms: "upload file drag drop attachment" },
  { name: "Select", section: "forms", terms: "dropdown select option form" },
  { name: "Checkbox", section: "forms", terms: "checkbox consent form" },
  { name: "Switch", section: "forms", terms: "toggle switch setting" },
  { name: "Radio group", section: "forms", terms: "radio choice form" },
  { name: "Alert", section: "feedback", terms: "alert banner info error warning success" },
  { name: "Toast", section: "feedback", terms: "toast notification message" },
  { name: "Progress", section: "feedback", terms: "progress bar loading completion" },
  { name: "Skeleton", section: "feedback", terms: "skeleton loading placeholder" },
  { name: "Spinner", section: "feedback", terms: "spinner loading progress" },
  { name: "Empty state", section: "feedback", terms: "empty state no results" },
  { name: "Modal", section: "overlays", terms: "dialog modal overlay" },
  { name: "Dropdown menu", section: "overlays", terms: "menu dropdown actions" },
  { name: "Tooltip", section: "overlays", terms: "tooltip hint hover" },
  { name: "Accordion", section: "overlays", terms: "accordion disclosure collapse" },
  { name: "Tabs", section: "navigation", terms: "tabs tablist navigation" },
  { name: "Breadcrumbs", section: "navigation", terms: "breadcrumbs navigation path" },
  { name: "Pagination", section: "navigation", terms: "pagination pages next previous" },
  { name: "Data table", section: "data", terms: "table rows columns data grid" },
  { name: "Card", section: "layout", terms: "card surface panel" },
  { name: "Grid", section: "layout", terms: "grid layout columns responsive" },
  { name: "Stack", section: "layout", terms: "stack layout vertical spacing" },
];

function isButtonVariant(value: string): value is ButtonVariant {
  return ["primary", "secondary", "ghost", "danger"].includes(value);
}

function isComponentSize(value: string): value is ComponentSize {
  return ["sm", "md", "lg"].includes(value);
}

function CodeSample({ code }: { code: string }) {
  const [showCode, setShowCode] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="mt-4 border-t border-[var(--border)] pt-3">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="text-[11px] font-semibold text-[var(--accent)] hover:underline"
          onClick={() => setShowCode((visible) => !visible)}
          aria-expanded={showCode}
        >
          {showCode ? "Hide code" : "View code"}
        </button>
        {showCode && (
          <button
            type="button"
            className="text-[10px] font-medium text-[var(--ink3)] hover:text-[var(--ink)]"
            onClick={copyCode}
          >
            {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy unavailable" : "Copy"}
          </button>
        )}
      </div>
      {showCode && (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-[#0B1929] p-4 text-[11px] leading-relaxed text-[#E8F3FF]">
          <code>{code}</code>
        </pre>
      )}
      {copyState === "error" && (
        <p className="mt-2 text-[11px] text-[var(--danger)]" role="status">
          Clipboard access was blocked. You can still select and copy the code above.
        </p>
      )}
    </div>
  );
}

function Showcase({
  id,
  title,
  description,
  tags,
  code,
  children,
}: {
  id: string;
  title: string;
  description: string;
  tags: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <article
      id={id}
      data-component-name={`${title.toLowerCase()} ${tags.toLowerCase()}`}
      className="scroll-mt-24 rounded-xl border border-[var(--border)] bg-white p-4 sm:p-5"
    >
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold text-[var(--ink)]">{title}</h3>
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--ink3)]">{description}</p>
      </div>
      <div className="flex min-h-20 flex-wrap items-center gap-3 rounded-lg bg-[#F5F8FC] p-4">
        {children}
      </div>
      <CodeSample code={code} />
    </article>
  );
}

function FoundationTokens() {
  const tokens = [
    { name: "Brand", token: "--av-color-brand", color: "var(--av-color-brand)" },
    { name: "Ink", token: "--av-color-ink", color: "var(--av-color-ink)" },
    { name: "Muted", token: "--av-color-muted", color: "var(--av-color-muted)" },
    { name: "Border", token: "--av-color-border", color: "var(--av-color-border)" },
    { name: "Surface", token: "--av-color-surface", color: "var(--av-color-surface)" },
    { name: "Success", token: "--av-color-success", color: "var(--av-color-success)" },
    { name: "Warning", token: "--av-color-warning", color: "var(--av-color-warning)" },
    { name: "Danger", token: "--av-color-danger", color: "var(--av-color-danger)" },
  ];

  return (
    <section id="foundations" className="scroll-mt-24">
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">01 · Foundations</p>
        <h2 className="mt-2 font-[family-name:var(--font-instrument-serif)] text-3xl text-[var(--black)]">Branding, made portable.</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-[var(--ink2)]">
          Every component reads from CSS custom properties. Override these tokens once to fit your product;
          typography, shape, focus rings, and semantic colors stay consistent across the library.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tokens.map((token) => (
          <div className="rounded-xl border border-[var(--border)] bg-white p-3" key={token.name}>
            <div className="mb-3 h-9 rounded-md border border-black/5" style={{ background: token.color }} />
            <p className="text-[11px] font-semibold text-[var(--ink)]">{token.name}</p>
            <code className="text-[9px] text-[var(--ink3)]">{token.token}</code>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-white p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink3)]">Type scale</p>
          <p className="text-2xl font-semibold text-[var(--ink)]">Display & headings</p>
          <p className="mt-1 text-[13px] text-[var(--ink2)]">Body text · readable by default</p>
          <p className="mt-1 font-mono text-[11px] text-[var(--ink3)]">Labels · code · metadata</p>
          <p className="mt-3 text-[9px] text-[var(--ink3)]">--av-font-heading · --av-font-body · --av-font-mono</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink3)]">Shape & spacing</p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] bg-[var(--white)] text-[9px] text-[var(--ink3)]">8px</div>
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-[var(--border)] bg-[var(--white)] text-[9px] text-[var(--ink3)]">12px</div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--white)] text-[9px] text-[var(--ink3)]">16px</div>
            <span className="text-[10px] text-[var(--ink3)]">Consistent spacing · smooth motion · visible focus</span>
          </div>
        </div>
      </div>
      <CodeSample code={`/* Import once in your app's global stylesheet */\n@import "@akhil-vanga/design-system/styles.css";\n\n/* Override tokens to apply your brand */\n:root {\n  --av-color-brand: #6750a4;\n  --av-color-brand-hover: #493879;\n  --av-font-body: "Your Brand Font", sans-serif;\n  --av-radius-sm: 0.375rem;\n}`} />
    </section>
  );
}

export function DesignSystemCatalog() {
  const [query, setQuery] = useState("");
  const [switchOn, setSwitchOn] = useState(true);
  const [radio, setRadio] = useState("monthly");
  const [page, setPage] = useState(2);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("primary");
  const [buttonSize, setButtonSize] = useState<ComponentSize>("md");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [rangeValue, setRangeValue] = useState(68);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleComponents = useMemo(
    () => searchableComponents.filter((component) => `${component.name} ${component.terms}`.toLowerCase().includes(normalizedQuery)),
    [normalizedQuery],
  );
  const visibleIds = new Set(visibleComponents.map((component) => component.name));
  const show = (name: string) => visibleIds.has(name);

  const people = [
    { id: 1, name: "Maya Chen", role: "Product designer", status: "Active" },
    { id: 2, name: "Jordan Lee", role: "Engineer", status: "Review" },
    { id: 3, name: "Priya Shah", role: "Product manager", status: "Active" },
    { id: 4, name: "Ethan Brooks", role: "Engineer", status: "Invited" },
    { id: 5, name: "Sofia Martinez", role: "Product designer", status: "Active" },
    { id: 6, name: "Noah Williams", role: "Researcher", status: "Review" },
    { id: 7, name: "Amara Okafor", role: "Engineer", status: "Active" },
    { id: 8, name: "Leo Kim", role: "Product manager", status: "Invited" },
    { id: 9, name: "Isabella Rossi", role: "Researcher", status: "Active" },
    { id: 10, name: "Mateo Alvarez", role: "Engineer", status: "Active" },
    { id: 11, name: "Ava Thompson", role: "Product designer", status: "Invited" },
  ];
  const departments = ["Design", "Engineering", "Product", "Research", "Operations"];
  const locations = ["San Francisco", "New York", "London", "Toronto", "Remote"];
  type MetricKey = `metric${number}`;
  type TeamTableRow = {
    id: number;
    name: string;
    role: string;
    status: string;
    department: string;
    location: string;
    projects: number;
    startDate: string;
  } & Record<MetricKey, number>;
  const tablePeople: TeamTableRow[] = Array.from({ length: 100 }, (_, index) => {
    const person = people[index % people.length];
    const metrics = Object.fromEntries(
      Array.from({ length: 22 }, (_, metricIndex) => [
        `metric${metricIndex + 1}`,
        ((index + metricIndex) % 100) + 1,
      ]),
    ) as Record<MetricKey, number>;
    return {
      ...person,
      id: index + 1,
      name: `Team member ${String(index + 1).padStart(3, "0")}`,
      department: departments[index % departments.length],
      location: locations[Math.floor(index / departments.length) % locations.length],
      projects: (index % 8) + 1,
      startDate: `202${index % 5}-${String((index % 12) + 1).padStart(2, "0")}-01`,
      ...metrics,
    };
  });
  const tableColumns: Array<DataTableColumn<TeamTableRow>> = [
    { key: "id", header: "ID" },
    { key: "name", header: "Member", render: (value) => <span className="inline-flex items-center gap-2.5"><Avatar name={String(value)} size="sm" /><span className="font-semibold text-[var(--ink)]">{String(value)}</span></span> },
    { key: "role", header: "Role", filterOptions: ["Engineer", "Product designer", "Product manager", "Researcher"].map((value) => ({ label: value, value })) },
    { key: "status", header: "Status", filterOptions: ["Active", "Review", "Invited"].map((value) => ({ label: value, value })), render: (value) => <Badge tone={value === "Active" ? "success" : value === "Review" ? "warning" : "neutral"}>{String(value)}</Badge> },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    { key: "projects", header: "Projects" },
    { key: "startDate", header: "Start date" },
    ...Array.from({ length: 22 }, (_, index) => ({
      key: `metric${index + 1}` as MetricKey,
      header: `Metric ${index + 1}`,
    })),
  ];

  return (
    <div className="av-root min-h-screen bg-[var(--white)]">
      <header data-hero className="relative overflow-hidden bg-[linear-gradient(130deg,#0B1929_0%,#123557_62%,#1A7DD4_150%)] px-5 pb-12 pt-28 text-white sm:px-8 sm:pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle, #79c5ff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="relative mx-auto max-w-[var(--max-w)]">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-[11px] text-white/60 transition hover:text-white">
            <span aria-hidden="true">←</span> Back to portfolio
          </Link>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8DCEFF]">Akhil Vanga · Open design system</p>
              <h1 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.04em]">
                Designed once.<br /><em className="font-normal text-[#8DCEFF]">Built to be reused.</em>
              </h1>
              <p className="mt-5 max-w-2xl text-[14px] leading-[1.8] text-white/65 sm:text-[16px]">
                A themeable React + TypeScript component library, with accessible defaults and live examples.
                Explore the building blocks, inspect the props, and bring the same system into your product.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[10px] text-white/80">React 18+</span>
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[10px] text-white/80">TypeScript</span>
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[10px] text-white/80">CSS tokens</span>
              <span className="rounded-full border border-[#8DCEFF]/30 bg-[#8DCEFF]/10 px-3 py-1.5 text-[10px] text-[#B5DFFF]">v0.1 · Preview</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[var(--max-w)] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-12">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <label className="mb-4 block">
            <span className="av-sr-only">Search components</span>
            <input
              className="av-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Find a component…"
            />
          </label>
          <nav aria-label="Design system sections" className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium text-[var(--ink2)] transition hover:bg-white hover:text-[var(--accent)]"
              >
                <span className="text-[var(--accent-light)]" aria-hidden="true">{section.icon}</span>
                {section.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 hidden rounded-xl border border-[var(--border)] bg-white p-4 lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ink3)]">Included</p>
            <p className="mt-2 font-[family-name:var(--font-instrument-serif)] text-3xl text-[var(--ink)]">30</p>
            <p className="text-[11px] text-[var(--ink3)]">reusable components & patterns</p>
          </div>
        </aside>

        <div className="min-w-0 space-y-12">
          <section className="rounded-xl border border-[var(--accent-light)]/25 bg-[var(--accent-light)]/5 p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[13px] font-semibold text-[var(--ink)]">Take it to your project</p>
                <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-[var(--ink2)]">
                  The source is organized as a standalone workspace package. Clone the repository, build the package,
                  then import typed components and the stylesheet. A public npm release can follow.
                </p>
              </div>
              <a href="#getting-started" className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[var(--accent-dark)]">
                Get started <span className="ml-2" aria-hidden="true">↘</span>
              </a>
            </div>
          </section>

          <FoundationTokens />

          <section id="actions" className="scroll-mt-24">
            <SectionHeading number="02" title="Actions" detail="Use the same action language across every product surface." />
            <Showcase id="button" title="Button" tags="action primary secondary ghost danger sizes loading" description="Typed variants and sizes map directly to Figma properties: variant=primary|secondary|ghost|danger, size=sm|md|lg." code={`import { Button } from "@akhil-vanga/design-system";\n\n<Button variant="primary" size="md">Create project</Button>\n<Button variant="secondary" disabled>Unavailable</Button>\n<Button variant="primary" loading>Saving</Button>`}>
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Destructive</Button>
              <Button size="sm" variant="secondary">Small</Button>
              <Button size="lg">Large</Button>
              <Button loading>Saving</Button>
              <div className="w-full rounded-lg border border-[var(--border)] bg-white p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold text-[var(--ink)]">Live prop controls</p>
                  <Badge tone="brand">Interactive</Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectField
                    label="variant"
                    value={buttonVariant}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      if (isButtonVariant(value)) setButtonVariant(value);
                    }}
                  >
                    <option value="primary">primary</option>
                    <option value="secondary">secondary</option>
                    <option value="ghost">ghost</option>
                    <option value="danger">danger</option>
                  </SelectField>
                  <SelectField
                    label="size"
                    value={buttonSize}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      if (isComponentSize(value)) setButtonSize(value);
                    }}
                  >
                    <option value="sm">sm</option>
                    <option value="md">md</option>
                    <option value="lg">lg</option>
                  </SelectField>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <Checkbox label="disabled" checked={buttonDisabled} onChange={(event) => setButtonDisabled(event.currentTarget.checked)} />
                  <Checkbox label="loading" checked={buttonLoading} onChange={(event) => setButtonLoading(event.currentTarget.checked)} />
                  <Button variant={buttonVariant} size={buttonSize} disabled={buttonDisabled} loading={buttonLoading}>
                    Try it out
                  </Button>
                </div>
              </div>
            </Showcase>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {show("Badge") && <Showcase id="badge" title="Badge" tags="tag chip status" description="Compact status, category, or count labels." code={`import { Badge } from "@akhil-vanga/design-system";\n\n<Badge tone="success">Published</Badge>\n<Badge tone="warning">In review</Badge>`}>
                <Badge tone="brand">New</Badge><Badge tone="success">Published</Badge><Badge tone="warning">In review</Badge><Badge tone="danger">Blocked</Badge>
              </Showcase>}
              {show("Icon button") && <Showcase id="icon-button" title="Icon button" tags="icon only button action accessible label" description="Compact icon-only action with a required accessible label." code={`import { IconButton } from "@akhil-vanga/design-system";\n\n<IconButton label="More options">···</IconButton>`}>
                <IconButton label="More options">···</IconButton><span className="text-[11px] text-[var(--ink2)]">Every icon button requires an accessible name.</span>
              </Showcase>}
              {show("Avatar") && <Showcase id="avatar" title="Avatar" tags="profile image initials" description="Image or generated initials with a useful accessible name." code={`import { Avatar } from "@akhil-vanga/design-system";\n\n<Avatar name="Akhil Vanga" size="md" />`}>
                <Avatar name="Akhil Vanga" size="sm" /><Avatar name="Maya Chen" /><Avatar name="Jordan Lee" size="lg" />
                <span className="text-[11px] text-[var(--ink2)]">Akhil Vanga · Maya Chen · Jordan Lee</span>
              </Showcase>}
            </div>
          </section>

          <section id="forms" className="scroll-mt-24">
            <SectionHeading number="03" title="Forms & inputs" detail="Labeled controls with validation, hints, and keyboard-visible focus." />
            <div className="grid gap-4 md:grid-cols-2">
              {show("Text field") && <Showcase id="text-field" title="Text field" tags="input text email password label validation" description="Automatically associates the label, hint, and error with the input." code={`import { TextField } from "@akhil-vanga/design-system";\n\n<TextField label="Work email" type="email" placeholder="you@company.com" hint="We'll never share your email." />`}>
                <div className="w-full max-w-sm"><TextField label="Work email" type="email" placeholder="you@company.com" hint="We'll never share your email." /></div>
              </Showcase>}
              {show("Text area") && <Showcase id="text-area" title="Text area" tags="textarea multiline form" description="Multiline input that keeps the same labeling and validation contract." code={`import { TextArea } from "@akhil-vanga/design-system";\n\n<TextArea label="Project notes" placeholder="Share a few details…" rows={3} />`}>
                <div className="w-full"><TextArea label="Project notes" placeholder="Share a few details…" rows={2} /></div>
              </Showcase>}
              {show("Date field") && <Showcase id="date-field" title="Date field" tags="date picker calendar date input" description="A native date control, styled consistently and accessible across input methods." code={`import { DateField } from "@akhil-vanga/design-system";\n\n<DateField label="Launch date" min="2026-01-01" />`}>
                <div className="w-full max-w-sm"><DateField label="Launch date" min="2026-01-01" /></div>
              </Showcase>}
              {show("Range slider") && <Showcase id="range-slider" title="Range slider" tags="slider range volume control" description="Controlled range input with a visible value and keyboard support." code={`import { RangeSlider } from "@akhil-vanga/design-system";\n\n<RangeSlider label="Volume" min={0} max={100} value={volume} onChange={setVolume} />`}>
                <div className="w-full max-w-sm"><RangeSlider label="Prototyping progress" value={rangeValue} onChange={setRangeValue} /></div>
              </Showcase>}
              {show("File dropzone") && <Showcase id="file-dropzone" title="File upload" tags="upload file drag drop attachment" description="Keyboard-accessible file picker with accepted types, multiple selection, and selected-file feedback." code={`import { FileDropzone } from "@akhil-vanga/design-system";\n\n<FileDropzone label="Add attachments" accept="image/*,.pdf" multiple />`}>
                <div className="w-full"><FileDropzone label="Drop files here or browse" hint="PNG, JPG or PDF · up to 10 MB" accept="image/*,.pdf" multiple /></div>
              </Showcase>}
              {show("Select") && <Showcase id="select" title="Select" tags="dropdown option form" description="Native select for dependable keyboard and screen-reader behavior." code={`import { SelectField } from "@akhil-vanga/design-system";\n\n<SelectField label="Team size" defaultValue="">\n  <option value="" disabled>Select a team size</option>\n  <option value="small">1–10 people</option>\n</SelectField>`}>
                <div className="w-full max-w-sm"><SelectField label="Team size" defaultValue=""><option value="" disabled>Select a team size</option><option value="small">1–10 people</option><option value="medium">11–50 people</option><option value="large">51+ people</option></SelectField></div>
              </Showcase>}
              {show("Checkbox") && <Showcase id="checkbox" title="Checkbox" tags="consent form" description="Use for independent, optional selections." code={`import { Checkbox } from "@akhil-vanga/design-system";\n\n<Checkbox label="Send me product updates" />`}>
                <Checkbox label="Send me product updates" defaultChecked />
              </Showcase>}
              {show("Switch") && <Showcase id="switch" title="Switch" tags="toggle setting" description="A controlled on/off setting with the switch accessibility role." code={`import { Switch } from "@akhil-vanga/design-system";\n\n<Switch label="Enable notifications" checked={enabled} onChange={setEnabled} />`}>
                <Switch label="Enable notifications" checked={switchOn} onChange={setSwitchOn} />
              </Showcase>}
              {show("Radio group") && <Showcase id="radio-group" title="Radio group" tags="radio choice form" description="Choose exactly one option from a clearly labeled group." code={`import { RadioGroup } from "@akhil-vanga/design-system";\n\n<RadioGroup legend="Billing" name="billing" value={billing} onChange={setBilling}\n  options={[{ label: "Monthly", value: "monthly" }, { label: "Yearly", value: "yearly" }]} />`}>
                <RadioGroup legend="Billing cycle" name="catalog-billing" value={radio} onChange={setRadio} options={[{ label: "Monthly", value: "monthly" }, { label: "Yearly (save 20%)", value: "yearly" }]} />
              </Showcase>}
            </div>
          </section>

          <section id="feedback" className="scroll-mt-24">
            <SectionHeading number="04" title="Feedback" detail="Keep users informed about progress, success, and next steps." />
            <div className="grid gap-4 md:grid-cols-2">
              {show("Alert") && <Showcase id="alert" title="Alert" tags="banner info error warning success" description="Persistent contextual feedback with semantic status roles." code={`import { Alert } from "@akhil-vanga/design-system";\n\n<Alert tone="success" title="Changes saved">Your settings are up to date.</Alert>`}>
                <div className="w-full"><Alert tone="success" title="Changes saved">Your settings are up to date.</Alert></div>
              </Showcase>}
              {show("Toast") && <Showcase id="toast" title="Toast" tags="notification message" description="Short-lived feedback; provide a persistent alternative for critical errors." code={`import { Toast } from "@akhil-vanga/design-system";\n\n<Toast tone="success" title="Invite sent">Your teammate will receive an email shortly.</Toast>`}>
                {toastVisible ? <Toast title="Invite sent">Your teammate will receive an email shortly.</Toast> : <Button variant="secondary" onClick={() => setToastVisible(true)}>Show notification</Button>}
                {toastVisible && <Button size="sm" variant="ghost" onClick={() => setToastVisible(false)}>Dismiss</Button>}
              </Showcase>}
              {show("Progress") && <Showcase id="progress" title="Progress" tags="bar loading completion" description="Clamped value with accessible progressbar semantics." code={`import { Progress } from "@akhil-vanga/design-system";\n\n<Progress value={68} label="Upload progress" />`}>
                <div className="w-full"><div className="mb-2 flex justify-between text-[11px]"><span>Uploading assets</span><span>68%</span></div><Progress value={68} label="Upload progress" /></div>
              </Showcase>}
              {show("Skeleton") && <Showcase id="skeleton" title="Skeleton" tags="loading placeholder" description="A motion-reduced-aware placeholder while content is loading." code={`import { Skeleton } from "@akhil-vanga/design-system";\n\n<Skeleton width="70%" height="1.25rem" />`}>
                <div className="w-full space-y-2"><Skeleton width="60%" height="1rem" /><Skeleton height=".75rem" /><Skeleton width="82%" height=".75rem" /></div>
              </Showcase>}
              {show("Spinner") && <Showcase id="spinner" title="Spinner" tags="loading progress" description="A compact loading indicator with an accessible status label." code={`import { Spinner } from "@akhil-vanga/design-system";\n\n<Spinner label="Loading results" />`}>
                <Spinner label="Loading results" /><span className="text-[11px] text-[var(--ink2)]">Loading results</span>
              </Showcase>}
              {show("Empty state") && <Showcase id="empty-state" title="Empty state" tags="no results" description="A clear, actionable explanation when there is nothing to show." code={`import { EmptyState, Button } from "@akhil-vanga/design-system";\n\n<EmptyState title="No projects yet" description="Create a project to get started."\n  action={<Button>Create project</Button>} />`}>
                <div className="w-full"><EmptyState title="No projects yet" description="Create your first project to get started." action={<Button size="sm">Create project</Button>} /></div>
              </Showcase>}
            </div>
          </section>

          <section id="overlays" className="scroll-mt-24">
            <SectionHeading number="05" title="Overlays & disclosure" detail="Reveal extra context without losing the user's place." />
            <div className="grid gap-4 md:grid-cols-2">
              {show("Modal") && <Showcase id="modal" title="Modal dialog" tags="dialog modal overlay" description="Native dialog provides focus management, escape handling, and a modal backdrop." code={`import { Modal, Button } from "@akhil-vanga/design-system";\n\n<Modal open={open} onClose={() => setOpen(false)} title="Invite your team">\n  Add teammates to collaborate on this project.\n</Modal>`}>
                <Button onClick={() => setModalOpen(true)}>Open dialog</Button>
                <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Invite your team" actions={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => setModalOpen(false)}>Send invite</Button></>}>
                  Add teammates to collaborate on this project.
                </Modal>
              </Showcase>}
              {show("Dropdown menu") && <Showcase id="dropdown-menu" title="Dropdown menu" tags="menu dropdown actions" description="Keyboard-navigable action menu that closes on selection, Escape, or outside click." code={`import { DropdownMenu } from "@akhil-vanga/design-system";\n\n<DropdownMenu label="More actions" items={[\n  { label: "Duplicate", onSelect: duplicate },\n  { label: "Archive", onSelect: archive },\n]} />`}>
                <DropdownMenu label="More actions" items={[{ label: "Duplicate", onSelect: () => undefined }, { label: "Archive", onSelect: () => undefined }]} />
              </Showcase>}
              {show("Tooltip") && <Showcase id="tooltip" title="Tooltip" tags="hint hover" description="Supplementary hint. Keep essential instructions visible outside the tooltip." code={`import { Tooltip, Button } from "@akhil-vanga/design-system";\n\n<Tooltip label="Save your changes">\n  <Button aria-label="Save">Save</Button>\n</Tooltip>`}>
                <Tooltip label="Save your changes"><Button variant="secondary">Hover or focus me</Button></Tooltip>
              </Showcase>}
              {show("Accordion") && <Showcase id="accordion" title="Accordion" tags="disclosure collapse" description="Native details and summary elements work without JavaScript." code={`import { Accordion } from "@akhil-vanga/design-system";\n\n<Accordion title="Can I theme the components?">\n  Yes. Override the --av-* CSS custom properties.\n</Accordion>`}>
                <div className="w-full"><Accordion title="Can I theme the components?" open>Yes. Override the --av-* CSS custom properties in your app.</Accordion></div>
              </Showcase>}
            </div>
          </section>

          <section id="navigation" className="scroll-mt-24">
            <SectionHeading number="06" title="Navigation" detail="Help users understand where they are and what content is available." />
            <div className="grid gap-4">
              {show("Tabs") && <Showcase id="tabs" title="Tabs" tags="tablist navigation" description="Keyboard arrow navigation, selected state, and associated tab panel." code={`import { Tabs } from "@akhil-vanga/design-system";\n\n<Tabs tabs={[\n  { label: "Overview", content: <p>Project overview</p> },\n  { label: "Activity", content: <p>Recent activity</p> },\n]} />`}>
                <div className="w-full"><Tabs tabs={[{ label: "Overview", content: <p className="text-[12px] text-[var(--ink2)]">Your workspace at a glance.</p> }, { label: "Activity", content: <p className="text-[12px] text-[var(--ink2)]">Recent team activity appears here.</p> }, { label: "Settings", content: <p className="text-[12px] text-[var(--ink2)]">Manage project preferences.</p> }]} /></div>
              </Showcase>}
              <div className="grid gap-4 sm:grid-cols-2">
                {show("Breadcrumbs") && <Showcase id="breadcrumbs" title="Breadcrumbs" tags="navigation path" description="Expose the current location and navigable parent hierarchy." code={`import { Breadcrumbs } from "@akhil-vanga/design-system";\n\n<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }, { label: "Apollo" }]} />`}>
                  <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Apollo" }]} />
                </Showcase>}
                {show("Pagination") && <Showcase id="pagination" title="Pagination" tags="pages next previous" description="Compact page windows, clear boundaries, and controlled navigation." code={`import { Pagination } from "@akhil-vanga/design-system";\n\n<Pagination page={page} pageCount={18} onPageChange={setPage} />`}>
                  <div className="w-full space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] text-[var(--ink2)]">Showing 21–30 of 184 items</span>
                      <Pagination page={page} pageCount={18} onPageChange={setPage} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3">
                      <span className="text-[10px] text-[var(--ink3)]">Jump to page</span>
                      <TextField aria-label="Jump to page" label="Page number" type="number" min={1} max={18} value={page} onChange={(event) => setPage(Math.min(Math.max(Number(event.currentTarget.value) || 1, 1), 18))} />
                    </div>
                  </div>
                </Showcase>}
              </div>
            </div>
          </section>

          <section id="data" className="scroll-mt-24">
            <SectionHeading number="07" title="Data display" detail="Practical patterns for dense product information." />
            {show("Data table") && <Showcase id="data-table" title="Data table" tags="table rows columns data grid filter sort search pagination responsive sticky column chooser" description="A dense-data pattern with sticky headers and member identity, a searchable column picker, horizontal scrolling, filters, sorting, and pagination. Try the 30-column table with 100 sample records." code={`import { DataTable, type DataTableColumn } from "@akhil-vanga/design-system";\n\ntype Member = { id: number; name: string; role: string; status: string };\nconst columns: DataTableColumn<Member>[] = [\n  { key: "name", header: "Member" },\n  { key: "role", header: "Role", filterOptions: roleOptions },\n  { key: "status", header: "Status", filterOptions: statusOptions },\n];\n<DataTable caption="Team members" columns={columns} rows={members}\n  pageSizeOptions={[10, 25, 50, 100]} initialPageSize={10} />`}>
              <div className="w-full">
                <DataTable
                  caption="Project team members"
                  searchPlaceholder="Search people, roles, status…"
                  pageSizeOptions={[10, 25, 50, 100]}
                  initialPageSize={10}
                  columns={tableColumns}
                  rows={tablePeople}
                />
              </div>
            </Showcase>}
          </section>

          <section id="layout" className="scroll-mt-24">
            <SectionHeading number="08" title="Layout primitives" detail="Small compositional helpers keep spacing and structure consistent." />
            <div className="grid gap-4 md:grid-cols-2">
              {show("Card") && <Showcase id="card" title="Card" tags="surface panel" description="A bordered surface for grouping related information." code={`import { Card } from "@akhil-vanga/design-system";\n\n<Card><div className="av-card__body">Reusable content surface</div></Card>`}>
                <div className="w-full"><Card><div className="av-card__body"><p className="font-semibold">Project overview</p><p className="mt-1 text-[11px] text-[var(--ink3)]">Updated just now · 4 collaborators</p></div></Card></div>
              </Showcase>}
              {show("Grid") && <Showcase id="grid" title="Grid" tags="layout columns responsive" description="A lightweight CSS grid helper for common responsive compositions." code={`import { Grid, Card } from "@akhil-vanga/design-system";\n\n<Grid columns="repeat(auto-fit, minmax(min(100%, 8rem), 1fr))" gap="1rem">\n  <Card>One</Card><Card>Two</Card><Card>Three</Card>\n</Grid>`}>
                <div className="w-full"><Grid columns="repeat(auto-fit, minmax(min(100%, 8rem), 1fr))" gap=".5rem"><Card><div className="av-card__body text-center text-[10px]">One</div></Card><Card><div className="av-card__body text-center text-[10px]">Two</div></Card><Card><div className="av-card__body text-center text-[10px]">Three</div></Card></Grid></div>
              </Showcase>}
              {show("Stack") && <Showcase id="stack" title="Stack" tags="layout vertical spacing" description="Arrange content vertically with a consistent, adjustable gap." code={`import { Stack, Button } from "@akhil-vanga/design-system";\n\n<Stack gap="0.75rem">\n  <p>Keep related content together.</p>\n  <Button>Continue</Button>\n</Stack>`}>
                <div className="w-full"><Stack gap=".5rem"><span className="text-[11px] text-[var(--ink2)]">Consistent vertical rhythm</span><Button size="sm">Continue</Button></Stack></div>
              </Showcase>}
            </div>
          </section>

          <section id="getting-started" className="scroll-mt-24 rounded-2xl bg-[#0B1929] p-5 text-white sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8DCEFF]">Use it in your project</p>
            <h2 className="mt-2 font-[family-name:var(--font-instrument-serif)] text-3xl">One package. Your brand.</h2>
            <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-white/60">
              The workspace package is ready to build and pack. Clone the repository, create a package archive, then install that archive in your own app.
              A public npm release is a separate step; this repo currently contains the usable source and package definition.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-lg border border-white/10 bg-white/5 p-4 text-[11px] leading-relaxed text-[#E8F3FF]"><code>{`# In the cloned portfolio repo\nnpm run build:design-system\nnpm pack --workspace=@akhil-vanga/design-system\n\n# In your own React app, install the generated .tgz archive\nnpm install ./akhil-vanga-design-system-0.1.0.tgz\n\n# Import the library stylesheet once in your app entry\nimport "@akhil-vanga/design-system/styles.css";\n\n# Use typed components\nimport { Button, TextField } from "@akhil-vanga/design-system";\n\n<Button variant="primary" size="md">Build something</Button>`}</code></pre>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold text-white">Figma → props → code</p>
                <p className="mt-1 text-[10px] leading-relaxed text-white/55">
                  Keep variant names aligned: Figma&apos;s Primary, Secondary, Ghost maps to the typed
                  <code className="mx-1 text-[#B5DFFF]">variant</code> values in React. Sizes use
                  <code className="mx-1 text-[#B5DFFF]">sm | md | lg</code> so examples and implementation share one vocabulary.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold text-white">Designed for extension</p>
                <p className="mt-1 text-[10px] leading-relaxed text-white/55">
                  This first release focuses on accessible, reusable primitives. Add product-specific
                  date pickers, charting, rich text, and advanced grids as separately tested modules.
                </p>
              </div>
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-white/40">
              The catalog currently documents 30 components and patterns. The repository package includes CSS tokens and TypeScript declarations when built.
              Specialized charts, rich text editors, and advanced data-grid features can be added as separately tested modules.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ number, title, detail }: { number: string; title: string; detail: string }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{number} · Component family</p>
      <h2 className="mt-2 font-[family-name:var(--font-instrument-serif)] text-3xl text-[var(--black)]">{title}</h2>
      <p className="mt-2 text-[13px] text-[var(--ink2)]">{detail}</p>
    </div>
  );
}
