"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
  type TableHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ComponentSize = "sm" | "md" | "lg";
type Tone = "neutral" | "brand" | "success" | "warning" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`av-button av-button--${variant}${size === "md" ? "" : ` av-button--${size}`} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner label="Loading" />}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  variant = "secondary",
  ...props
}: Omit<ButtonProps, "children" | "aria-label"> & { label: string; children: ReactNode }) {
  return (
    <Button className="av-icon-button" variant={variant} aria-label={label} {...props}>
      {children}
    </Button>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span role="status" aria-label={label} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
      <span className="av-spinner" aria-hidden="true" />
      <span className="av-sr-only">{label}</span>
    </span>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return <span className={`av-badge av-badge--${tone}`}>{children}</span>;
}

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({ label, hint, error, id, className = "", ...props }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;

  return (
    <label className="av-field" htmlFor={fieldId}>
      <span className="av-label">{label}</span>
      <input
        id={fieldId}
        className={`av-input ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? descriptionId : undefined}
        {...props}
      />
      {(hint || error) && (
        <span id={descriptionId} className={error ? "av-error" : "av-hint"}>
          {error ?? hint}
        </span>
      )}
    </label>
  );
}

export type DateFieldProps = Omit<TextFieldProps, "type">;

export function DateField(props: DateFieldProps) {
  return <TextField {...props} type="date" />;
}

export function RangeSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 100;
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, safeMin), safeMax) : safeMin;

  return (
    <label className="av-field" htmlFor={id}>
      <span className="av-label">{label}</span>
      <input
        id={id}
        className="av-range"
        type="range"
        min={safeMin}
        max={safeMax}
        step={step}
        value={safeValue}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
      <span className="av-hint">{safeValue}</span>
    </label>
  );
}

export function FileDropzone({
  label = "Upload files",
  hint = "Choose files from your device",
  accept,
  multiple = false,
  onFilesSelected,
}: {
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: FileList | null) => void;
}) {
  const id = useId();
  const [fileNames, setFileNames] = useState<string[]>([]);

  return (
    <div className="av-field">
      <label className="av-file-dropzone" htmlFor={id}>
        <input
          id={id}
          className="av-sr-only"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(event) => {
            const files = event.currentTarget.files;
            setFileNames(files ? Array.from(files, (file) => file.name) : []);
            onFilesSelected?.(files);
          }}
        />
        <span className="av-file-dropzone__icon" aria-hidden="true">↑</span>
        <strong>{label}</strong>
        <span className="av-hint">{fileNames.length ? fileNames.join(", ") : hint}</span>
      </label>
    </div>
  );
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextArea({ label, hint, error, id, className = "", ...props }: TextAreaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;

  return (
    <label className="av-field" htmlFor={fieldId}>
      <span className="av-label">{label}</span>
      <textarea
        id={fieldId}
        className={`av-input av-textarea ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? descriptionId : undefined}
        {...props}
      />
      {(hint || error) && (
        <span id={descriptionId} className={error ? "av-error" : "av-hint"}>
          {error ?? hint}
        </span>
      )}
    </label>
  );
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export type SelectControlProps = SelectHTMLAttributes<HTMLSelectElement>;

export function SelectControl({ className = "", children, ...props }: SelectControlProps) {
  return (
    <select className={`av-select ${className}`.trim()} {...props}>
      {children}
    </select>
  );
}

export function SelectField({
  label,
  hint,
  error,
  id,
  className = "",
  children,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;

  return (
    <label className="av-field" htmlFor={fieldId}>
      <span className="av-label">{label}</span>
      <SelectControl
        id={fieldId}
        className={className}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? descriptionId : undefined}
        {...props}
      >
        {children}
      </SelectControl>
      {(hint || error) && (
        <span id={descriptionId} className={error ? "av-error" : "av-hint"}>
          {error ?? hint}
        </span>
      )}
    </label>
  );
}

export function Checkbox({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="av-checkbox-row">
      <input type="checkbox" className={`av-checkbox ${className}`.trim()} {...props} />
      <span>{label}</span>
    </label>
  );
}

export function Switch({
  label,
  checked,
  onChange,
  disabled,
  name,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
}) {
  const id = useId();

  return (
    <label className="av-switch" htmlFor={id}>
      <input
        id={id}
        name={name}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      <span className="av-switch-track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="av-field" style={{ border: 0, padding: 0 }}>
      <legend className="av-label">{legend}</legend>
      {options.map((option) => (
        <label className="av-checkbox-row" key={option.value}>
          <input
            className="av-checkbox"
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={(event) => onChange(event.currentTarget.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`av-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`av-alert av-alert--${tone}`} role={tone === "danger" ? "alert" : "status"}>
      <div>
        {title && <strong style={{ display: "block", marginBottom: ".125rem" }}>{title}</strong>}
        {children}
      </div>
    </div>
  );
}

export function Toast({
  tone = "success",
  title,
  children,
}: {
  tone?: "success" | "warning" | "danger";
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={`av-alert av-alert--${tone}`} role={tone === "danger" ? "alert" : "status"}>
      <div>
        <strong style={{ display: "block" }}>{title}</strong>
        {children}
      </div>
    </div>
  );
}

export function Progress({
  value,
  max = 100,
  label,
}: {
  value: number;
  max?: number;
  label: string;
}) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), safeMax) : 0;
  const percentage = (safeValue / safeMax) * 100;

  return (
    <div
      className="av-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
    >
      <span style={{ width: `${percentage}%` }} />
    </div>
  );
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <span
      className={`av-skeleton ${className}`.trim()}
      aria-hidden="true"
      style={{ width, height }}
    />
  );
}

export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: ComponentSize;
}) {
  const dimension = size === "sm" ? "2rem" : size === "lg" ? "3.25rem" : "2.5rem";
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className="av-avatar" style={{ width: dimension, height: dimension }} aria-label={name} role="img">
      {src ? (
        // Keep the package framework-agnostic; consumers can pass image URLs from any host.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" />
      ) : initials}
    </span>
  );
}

export function Tabs({
  tabs,
  label = "Content sections",
}: {
  tabs: Array<{ label: string; content: ReactNode }>;
  label?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const id = useId();
  const activeTab = tabs[activeIndex];

  if (tabs.length === 0) return null;

  return (
    <div>
      <div className="av-tabs" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            id={`${id}-tab-${index}`}
            className="av-tab"
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`${id}-panel`}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const nextIndex =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? tabs.length - 1
                    : (activeIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
              setActiveIndex(nextIndex);
              document.getElementById(`${id}-tab-${nextIndex}`)?.focus();
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${activeIndex}`} style={{ paddingTop: "1rem" }}>
        {activeTab?.content}
      </div>
    </div>
  );
}

export function Accordion({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="av-accordion" open={open}>
      <summary>{title}</summary>
      <div className="av-accordion__content">{children}</div>
    </details>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const dialogRef = useId();
  const [element, setElement] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [element, open]);

  return (
    <dialog
      ref={setElement}
      className="av-dialog"
      aria-labelledby={`${dialogRef}-title`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const clickedBackdrop =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom;
        if (clickedBackdrop) onClose();
      }}
    >
      <div className="av-dialog__header">
        <strong id={`${dialogRef}-title`}>{title}</strong>
        <button className="av-button av-button--ghost av-button--sm" type="button" onClick={onClose} aria-label="Close dialog">
          ✕
        </button>
      </div>
      <div className="av-dialog__body">{children}</div>
      {actions && <div className="av-dialog__footer">{actions}</div>}
    </dialog>
  );
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  label = "Pagination",
  siblingCount = 1,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  label?: string;
  siblingCount?: number;
}) {
  const count = Number.isFinite(pageCount) ? Math.max(0, Math.floor(pageCount)) : 0;
  if (count < 1) return null;
  const requestedPage = Number.isFinite(page) ? Math.floor(page) : 1;
  const current = Math.min(Math.max(requestedPage, 1), count);
  const siblings = Number.isFinite(siblingCount) ? Math.max(0, Math.floor(siblingCount)) : 1;
  const visiblePages = new Set<number>([
    1,
    count,
    ...Array.from({ length: siblings * 2 + 1 }, (_, index) => current - siblings + index),
  ]);
  const pageItems: Array<number | "start-ellipsis" | "end-ellipsis"> = [];
  let previous = 0;

  for (const number of [...visiblePages].filter((item) => item >= 1 && item <= count).sort((a, b) => a - b)) {
    const gap = number - previous;
    if (gap === 2) pageItems.push(previous + 1);
    else if (gap > 2) pageItems.push(previous === 1 ? "start-ellipsis" : "end-ellipsis");
    pageItems.push(number);
    previous = number;
  }

  return (
    <nav className="av-pagination" aria-label={label}>
      <button className="av-pagination__edge" type="button" aria-label="Go to previous page" disabled={current === 1} onClick={() => onPageChange(current - 1)}>
        <span aria-hidden="true">←</span>
      </button>
      {pageItems.map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            aria-label={`Go to page ${item}`}
            aria-current={item === current ? "page" : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ) : (
          <span className="av-pagination__ellipsis" key={item} aria-hidden="true">…</span>
        ),
      )}
      <button className="av-pagination__edge" type="button" aria-label="Go to next page" disabled={current === count} onClick={() => onPageChange(current + 1)}>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}

export interface DataTableColumn<Row> {
  key: keyof Row;
  header: string;
  render?: (value: Row[keyof Row], row: Row) => ReactNode;
  sortable?: boolean;
  filterOptions?: Array<{ label: string; value: string }>;
}

export function DataTable<Row extends { id: string | number }>({
  columns,
  rows,
  caption,
  searchPlaceholder = "Search this table…",
  pageSizeOptions = [10, 25, 50, 100],
  initialPageSize = 10,
  searchable = true,
  columnsToggleable = true,
  ...props
}: {
  columns: Array<DataTableColumn<Row>>;
  rows: Row[];
  caption: string;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  searchable?: boolean;
  columnsToggleable?: boolean;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "children">) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnsOpen, setColumnsOpen] = useState(false);
  const generatedId = useId();
  const [sortKey, setSortKey] = useState<keyof Row | null>(null);
  const [sortDirection, setSortDirection] = useState<"ascending" | "descending">("ascending");
  const [page, setPage] = useState(1);
  const allowedSizes = pageSizeOptions.filter((size) => Number.isFinite(size) && size > 0);
  const fallbackSize = allowedSizes[0] ?? 5;
  const [pageSize, setPageSize] = useState(
    allowedSizes.includes(initialPageSize) ? initialPageSize : fallbackSize,
  );

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const result = rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        columns.some((column) => String(row[column.key] ?? "").toLocaleLowerCase().includes(normalizedQuery));
      const matchesFilters = columns.every((column) => {
        const selected = filters[String(column.key)];
        return !selected || String(row[column.key] ?? "") === selected;
      });
      return matchesQuery && matchesFilters;
    });

    if (!sortKey) return result;
    const direction = sortDirection === "ascending" ? 1 : -1;
    return [...result].sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];
      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return (leftValue - rightValue) * direction;
      }
      return String(leftValue ?? "").localeCompare(String(rightValue ?? ""), undefined, {
        numeric: true,
        sensitivity: "base",
      }) * direction;
    });
  }, [columns, filters, query, rows, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const startIndex = filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const activeFilters = Object.values(filters).filter(Boolean).length;
  const hasActiveCriteria = activeFilters > 0 || query.trim().length > 0;
  const visibleColumns = columns.filter((column) => columnVisibility[String(column.key)] !== false);
  const hiddenColumnCount = columns.length - visibleColumns.length;
  const columnsPanelId = `${generatedId}-columns`;

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateFilter(key: keyof Row, value: string) {
    setFilters((current) => ({ ...current, [String(key)]: value }));
    setPage(1);
  }

  function toggleSort(key: keyof Row) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "ascending" ? "descending" : "ascending"));
    } else {
      setSortKey(key);
      setSortDirection("ascending");
    }
    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setFilters({});
    setPage(1);
  }

  return (
    <div className="av-data-table">
      {(searchable || columns.some((column) => column.filterOptions?.length) || (columnsToggleable && columns.length > 1)) && (
        <div className="av-data-table__toolbar">
          {searchable && (
            <label className="av-data-table__search av-field">
              <span className="av-label">Search</span>
              <input
                className="av-input"
                type="search"
                value={query}
                placeholder={searchPlaceholder}
                onChange={(event) => updateQuery(event.currentTarget.value)}
              />
            </label>
          )}
          <div className="av-data-table__filters" aria-label="Table filters">
            {columns.filter((column) => column.filterOptions?.length).map((column) => (
              <label className="av-field" key={String(column.key)}>
                <span className="av-label">{column.header}</span>
                <SelectControl
                  className="av-data-table__filter"
                  value={filters[String(column.key)] ?? ""}
                  onChange={(event) => updateFilter(column.key, event.currentTarget.value)}
                >
                  <option value="">All {column.header.toLocaleLowerCase()}</option>
                  {column.filterOptions?.map((option) => (
                    <option value={option.value} key={option.value}>{option.label}</option>
                  ))}
                </SelectControl>
              </label>
            ))}
            {hasActiveCriteria && (
              <button className="av-button av-button--ghost av-button--sm" type="button" onClick={clearFilters}>
                Reset filters
              </button>
            )}
            {columnsToggleable && columns.length > 1 && (
              <div className="av-field av-data-table__columns-control">
                <span className="av-label">Columns</span>
                <button
                  className="av-button av-button--secondary av-data-table__columns-toggle"
                  type="button"
                  aria-expanded={columnsOpen}
                  aria-controls={columnsOpen ? columnsPanelId : undefined}
                  onClick={() => setColumnsOpen((open) => !open)}
                >
                  Choose columns <span className="av-data-table__columns-count">{visibleColumns.length}/{columns.length}</span>
                </button>
              </div>
            )}
          </div>
          {columnsToggleable && columnsOpen && columns.length > 1 && (
            <fieldset
              id={columnsPanelId}
              className="av-data-table__columns-panel"
            >
              <legend className="av-data-table__columns-legend">Visible columns</legend>
              {columns.map((column) => {
                const key = String(column.key);
                const checked = columnVisibility[key] !== false;
                const setChecked = (nextChecked: boolean) => {
                  setColumnVisibility((current) => ({ ...current, [key]: nextChecked }));
                };
                return (
                  <label className="av-checkbox-row av-data-table__column-option" key={key}>
                    <input
                      className="av-checkbox"
                      type="checkbox"
                      checked={checked}
                      disabled={checked && visibleColumns.length === 1}
                      onChange={(event) => setChecked(event.currentTarget.checked)}
                    />
                    <span>{column.header}</span>
                  </label>
                );
              })}
              {hiddenColumnCount > 0 && (
                <button
                  className="av-button av-button--ghost av-button--sm av-data-table__columns-reset"
                  type="button"
                  onClick={() => setColumnVisibility({})}
                >
                  Show all columns
                </button>
              )}
            </fieldset>
          )}
          {columns.length > 4 && (
            <p className="av-data-table__scroll-hint">Scroll table horizontally to see all columns</p>
          )}
        </div>
      )}
      <div className="av-data-table__scroll" tabIndex={0} aria-label={`${caption}: scroll horizontally to see all columns`}>
        <table className="av-table" {...props}>
          <caption className="av-sr-only">{caption}</caption>
          <thead>
            <tr>
              {visibleColumns.map((column) => {
                const activeSort = sortKey === column.key;
                const ariaSort = activeSort ? sortDirection : sortKey ? "none" : undefined;
                return (
                  <th key={String(column.key)} scope="col" aria-sort={ariaSort}>
                    {column.sortable === false ? column.header : (
                      <button className="av-table__sort" type="button" onClick={() => toggleSort(column.key)}>
                        {column.header}
                        <span className="av-table__sort-indicator" aria-hidden="true">
                          {activeSort ? (sortDirection === "ascending" ? "↑" : "↓") : "↕"}
                        </span>
                        <span className="av-sr-only">
                          {activeSort ? `Sorted ${sortDirection}` : "Sort"}
                        </span>
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id}>
                {visibleColumns.map((column) => {
                  const value = row[column.key];
                  return <td key={String(column.key)}>{column.render ? column.render(value, row) : String(value ?? "")}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {pageRows.length === 0 && (
          <div className="av-data-table__empty" role="status">
            <strong>{rows.length === 0 ? "No data yet" : "No matching results"}</strong>
            <p>{rows.length === 0 ? "Add records to see them here." : "Try a different search or clear your filters."}</p>
            {rows.length > 0 && hasActiveCriteria && (
              <button className="av-button av-button--secondary av-button--sm" type="button" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
      <div className="av-data-table__footer">
        <span className="av-pagination__summary" aria-live="polite">
          {filteredRows.length === 0
            ? "0 results"
            : `${startIndex + 1}–${Math.min(startIndex + pageSize, filteredRows.length)} of ${filteredRows.length}`}
          {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters === 1 ? "" : "s"} active`}
        </span>
        <label className="av-field" style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: ".5rem" }}>
          <span className="av-hint">Rows</span>
          <SelectControl
            className="av-data-table__page-size"
            aria-label="Rows per page"
            value={pageSize}
            onChange={(event) => {
              const nextSize = Number(event.currentTarget.value);
              if (allowedSizes.includes(nextSize)) {
                setPageSize(nextSize);
                setPage(1);
              }
            }}
          >
            {allowedSizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </SelectControl>
        </label>
        {filteredRows.length > pageSize && (
          <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} label={`${caption} pages`} />
        )}
      </div>
    </div>
  );
}

export function Breadcrumbs({
  items,
  label = "Breadcrumb",
}: {
  items: Array<{ label: string; href?: string }>;
  label?: string;
}) {
  return (
    <nav className="av-breadcrumbs" aria-label={label}>
      <ol style={{ display: "contents", listStyle: "none" }}>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href && index < items.length - 1 ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="av-tooltip" data-tooltip={label}>
      {children}
    </span>
  );
}

export function DropdownMenu({
  label,
  items,
}: {
  label: string;
  items: Array<{ label: string; href?: string; onSelect?: () => void }>;
}) {
  const [open, setOpen] = useState(false);
  const [opensAbove, setOpensAbove] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const positionMenu = () => {
      const trigger = triggerRef.current?.getBoundingClientRect();
      const menu = menuRef.current?.getBoundingClientRect();
      if (!trigger || !menu) return;
      const spaceBelow = window.innerHeight - trigger.bottom;
      const spaceAbove = trigger.top;
      setOpensAbove(spaceBelow < menu.height + 12 && spaceAbove > spaceBelow);
    };
    const frame = requestAnimationFrame(positionMenu);
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("resize", positionMenu);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("resize", positionMenu);
    };
  }, [open]);

  function focusMenuItem(position: "first" | "last") {
    const menuItems = rootRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!menuItems?.length) return;
    menuItems[position === "first" ? 0 : menuItems.length - 1].focus();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        const position = event.key === "ArrowDown" ? "first" : "last";
        requestAnimationFrame(() => focusMenuItem(position));
      } else {
        const menuItems = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
        if (menuItems.length === 0) return;
        const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);
        const nextIndex = event.key === "ArrowDown"
          ? (currentIndex + 1) % menuItems.length
          : (currentIndex <= 0 ? menuItems.length : currentIndex) - 1;
        menuItems[nextIndex]?.focus();
      }
      return;
    }

    if ((event.key === "Home" || event.key === "End") && open) {
      event.preventDefault();
      focusMenuItem(event.key === "Home" ? "first" : "last");
    }

    if (event.key === "Tab") setOpen(false);
  }

  function selectItem(onSelect?: () => void) {
    onSelect?.();
    setOpen(false);
  }

  return (
    <div className="av-menu" ref={rootRef} onKeyDown={handleKeyDown}>
      <button
        className="av-button av-button--secondary av-menu__trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
      >
        <span>{label}</span>
        <svg className="av-menu__chevron" aria-hidden="true" viewBox="0 0 16 16" fill="none">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div
          className={`av-menu__items${opensAbove ? " av-menu__items--above" : ""}`}
          id={menuId}
          role="menu"
          ref={menuRef}
        >
          {items.map((item) =>
            item.href ? (
              <a key={item.label} href={item.href} role="menuitem" onClick={() => selectItem(item.onSelect)}>{item.label}</a>
            ) : (
              <button key={item.label} type="button" role="menuitem" onClick={() => selectItem(item.onSelect)}>{item.label}</button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div style={{ display: "grid", minHeight: "10rem", placeContent: "center", justifyItems: "center", gap: ".5rem", padding: "1.5rem", textAlign: "center" }}>
      <span aria-hidden="true" style={{ fontSize: "1.5rem" }}>◇</span>
      <strong>{title}</strong>
      <p style={{ margin: 0, color: "var(--av-color-muted)" }}>{description}</p>
      {action}
    </div>
  );
}

export function Stack({ children, gap = "1rem" }: { children: ReactNode; gap?: string }) {
  return <div style={{ display: "flex", flexDirection: "column", gap }}>{children}</div>;
}

export function Grid({ children, columns = "repeat(auto-fit, minmax(min(100%, 12rem), 1fr))", gap = "1rem" }: { children: ReactNode; columns?: string; gap?: string }) {
  return <div style={{ display: "grid", gridTemplateColumns: columns, gap }}>{children}</div>;
}

export type { ButtonVariant, ComponentSize, Tone };
