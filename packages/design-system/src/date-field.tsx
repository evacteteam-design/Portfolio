"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from "react";
import { Button, type TextFieldProps } from "./components.js";
import {
  MAX_YEAR,
  MIN_YEAR,
  addDays,
  addMonths,
  addYears,
  clampIso,
  endOfMonth,
  endOfWeek,
  formatDate,
  formatPlaceholder,
  getDateFormat,
  getDateLabels,
  getMonthGrid,
  isIso,
  isOutOfRange,
  parseDateInput,
  startOfMonth,
  startOfWeek,
  toIso,
  todayIso,
  type DateFormat,
  type DateLabels,
  type WeekStart,
} from "./date-utils.js";

export interface DateFieldProps
  extends Omit<TextFieldProps, "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "name"> {
  /** Selected date as "YYYY-MM-DD", or "" for none. */
  value?: string;
  defaultValue?: string;
  /** Called with a valid in-range "YYYY-MM-DD" date, or "" when the field is cleared or the text isn't a usable date. */
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  /** Submits the "YYYY-MM-DD" value with native forms. */
  name?: string;
  /** Sets the typed format and the calendar's month and weekday names. */
  locale?: string;
  /** 0 = Sunday, 1 = Monday … */
  weekStartsOn?: WeekStart;
}

interface Draft {
  text: string;
  /** The date the text currently stands for ("" when it isn't a usable date). */
  implied: string;
}

const MOBILE_QUERY = "(max-width: 40rem)";

function rangeMessage(format: DateFormat, min?: string, max?: string) {
  if (min && max) return `Choose a date between ${formatDate(min, format)} and ${formatDate(max, format)}.`;
  if (min) return `Choose a date on or after ${formatDate(min, format)}.`;
  return `Choose a date on or before ${formatDate(max ?? "", format)}.`;
}

export function DateField({
  label,
  hint,
  error,
  id,
  className = "",
  value,
  defaultValue,
  onChange,
  min,
  max,
  name,
  locale = "en-US",
  weekStartsOn = 0,
  placeholder,
  disabled,
  readOnly,
  onBlur,
  onKeyDown,
  onInvalid,
  "aria-describedby": describedBy,
  ...props
}: DateFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  const formatId = `${fieldId}-format`;
  const minIso = isIso(min) ? min : undefined;
  const maxIso = isIso(max) ? max : undefined;
  const weekStart: WeekStart = Number.isInteger(weekStartsOn) && weekStartsOn >= 0 && weekStartsOn <= 6 ? weekStartsOn : 0;
  const format = getDateFormat(locale);
  const labels = getDateLabels(locale);
  const formatHint = formatPlaceholder(format);

  const [innerValue, setInnerValue] = useState(() => (isIso(defaultValue) ? defaultValue : ""));
  const isControlled = value !== undefined;
  const committed = isControlled ? (isIso(value) ? value : "") : innerValue;
  const [draft, setDraft] = useState<Draft | null>(null);
  const [showInvalid, setShowInvalid] = useState(false);
  const [openedOn, setOpenedOn] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(false);

  // Keep what the person typed while it still stands for the current value; otherwise show the value.
  const text = draft && draft.implied === committed ? draft.text : formatDate(committed, format);
  const parsed = parseDateInput(text, format);
  const validationMessage =
    parsed.kind === "invalid"
      ? `Enter a date as ${formatHint}.`
      : parsed.kind === "valid" && isOutOfRange(parsed.iso, minIso, maxIso)
        ? rangeMessage(format, minIso, maxIso)
        : "";
  const shownError = error ?? (showInvalid && validationMessage ? validationMessage : undefined);
  const ariaDescribedBy = [describedBy, formatId, hint || shownError ? descriptionId : ""].filter(Boolean).join(" ");

  useEffect(() => {
    inputRef.current?.setCustomValidity(validationMessage);
  }, [validationMessage]);

  useEffect(() => {
    if (openedOn || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    triggerRef.current?.focus();
  }, [openedOn]);

  function commit(next: string) {
    if (next === committed) return;
    if (!isControlled) setInnerValue(next);
    onChange?.(next);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextText = event.target.value;
    const result = parseDateInput(nextText, format);
    const implied = result.kind === "valid" && !isOutOfRange(result.iso, minIso, maxIso) ? result.iso : "";
    setDraft({ text: nextText, implied });
    setShowInvalid(false);
    commit(implied);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    onBlur?.(event);
    // Tidy usable text into the standard format ("1/5/2026" -> "01/05/2026"); leave unusable text for fixing.
    if (draft && (parsed.kind === "empty" || (parsed.kind === "valid" && !validationMessage))) setDraft(null);
    setShowInvalid(true);
  }

  function handleInvalid(event: FormEvent<HTMLInputElement>) {
    onInvalid?.(event);
    setShowInvalid(true);
  }

  function openCalendar() {
    if (disabled || readOnly) return;
    setOpenedOn(todayIso());
  }

  function closeCalendar() {
    restoreFocusRef.current = true;
    setOpenedOn(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.altKey && event.key === "ArrowDown") {
      event.preventDefault();
      openCalendar();
    }
  }

  function selectDate(iso: string) {
    setDraft(null);
    setShowInvalid(false);
    commit(iso);
    closeCalendar();
  }

  return (
    <div className="av-field">
      <label className="av-label" htmlFor={fieldId}>
        {label}
      </label>
      <div className="av-date" ref={anchorRef}>
        <input
          ref={inputRef}
          id={fieldId}
          type="text"
          autoComplete="off"
          spellCheck={false}
          className={`av-input av-date__input ${className}`.trim()}
          placeholder={placeholder ?? formatHint}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={ariaDescribedBy}
          {...props}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onInvalid={handleInvalid}
        />
        <button
          ref={triggerRef}
          type="button"
          className="av-date__trigger"
          aria-label={committed ? `Change ${label}, ${labels.fullDate(committed)}` : `Choose ${label}`}
          aria-haspopup="dialog"
          aria-expanded={openedOn !== null}
          disabled={disabled || readOnly}
          onClick={openCalendar}
        >
          <CalendarDays size={18} aria-hidden="true" />
        </button>
      </div>
      <span id={formatId} className="av-sr-only">
        Format {formatHint}
      </span>
      {(hint || shownError) && (
        <span id={descriptionId} className={shownError ? "av-error" : "av-hint"}>
          {shownError ?? hint}
        </span>
      )}
      {name && <input type="hidden" name={name} value={committed} disabled={disabled} form={props.form} />}
      {openedOn && (
        <DateCalendarPopup
          label={label}
          value={committed}
          today={openedOn}
          min={minIso}
          max={maxIso}
          weekStartsOn={weekStart}
          labels={labels}
          anchorRef={anchorRef}
          onSelect={selectDate}
          onClose={closeCalendar}
        />
      )}
    </div>
  );
}

interface DateCalendarPopupProps {
  label: string;
  value: string;
  today: string;
  min?: string;
  max?: string;
  weekStartsOn: WeekStart;
  labels: DateLabels;
  anchorRef: RefObject<HTMLDivElement | null>;
  onSelect: (iso: string) => void;
  onClose: () => void;
}

function DateCalendarPopup({
  label,
  value,
  today,
  min,
  max,
  weekStartsOn,
  labels,
  anchorRef,
  onSelect,
  onClose,
}: DateCalendarPopupProps) {
  const headingId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const focusPendingRef = useRef(false);
  const [initialFocus] = useState(() => clampIso(value || today, min, max));
  const [focusIso, setFocusIso] = useState(initialFocus);

  const viewYear = Number(focusIso.slice(0, 4));
  const viewMonth = Number(focusIso.slice(5, 7));
  const baseYear = Number(initialFocus.slice(0, 4));
  const firstYear = Math.max(MIN_YEAR, baseYear - 100, min ? Number(min.slice(0, 4)) : MIN_YEAR);
  const lastYear = Math.min(MAX_YEAR, baseYear + 100, max ? Number(max.slice(0, 4)) : MAX_YEAR);
  const years: number[] = [];
  for (let year = firstYear; year <= lastYear; year += 1) years.push(year);
  if (!years.includes(viewYear)) years.push(viewYear);
  years.sort((a, b) => a - b);

  const monthStart = startOfMonth(focusIso);
  const prevDisabled = !!min && addDays(monthStart, -1) < min;
  const nextDisabled = !!max && addDays(endOfMonth(focusIso), 1) > max;
  const weekdays = Array.from({ length: 7 }, (_, index) => (weekStartsOn + index) % 7);
  const grid = getMonthGrid(viewYear, viewMonth, weekStartsOn);

  // Opens in the top layer so the calendar escapes clipped and transformed ancestors, including Modal.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    const mobile = window.matchMedia(MOBILE_QUERY);
    let frame = 0;
    const place = () => {
      frame = 0;
      const anchor = anchorRef.current;
      if (mobile.matches || !anchor) {
        dialog.style.removeProperty("left");
        dialog.style.removeProperty("top");
        return;
      }
      const gap = 6;
      const margin = 8;
      const rect = anchor.getBoundingClientRect();
      const width = dialog.offsetWidth;
      const height = dialog.offsetHeight;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;
      const below = rect.bottom + gap;
      const above = rect.top - gap - height;
      const fitsBelow = below + height <= viewportHeight - margin;
      const fitsAbove = above >= margin;
      const top = fitsBelow || (!fitsAbove && viewportHeight - rect.bottom >= rect.top) ? below : above;
      const left = Math.max(margin, Math.min(rect.left, viewportWidth - width - margin));
      dialog.style.left = `${left}px`;
      dialog.style.top = `${Math.max(margin, Math.min(top, viewportHeight - height - margin))}px`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    place();
    dialog.querySelector<HTMLButtonElement>('.av-calendar__day[tabindex="0"]')?.focus();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    mobile.addEventListener("change", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      mobile.removeEventListener("change", schedule);
    };
  }, [anchorRef]);

  useEffect(() => {
    if (!focusPendingRef.current) return;
    focusPendingRef.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('.av-calendar__day[tabindex="0"]')?.focus();
  }, [focusIso]);

  function moveTo(iso: string, moveFocus = false) {
    const next = clampIso(iso, min, max);
    if (next === focusIso) return;
    focusPendingRef.current = moveFocus;
    setFocusIso(next);
  }

  function handleGridKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(focusIso, -1),
      ArrowRight: () => addDays(focusIso, 1),
      ArrowUp: () => addDays(focusIso, -7),
      ArrowDown: () => addDays(focusIso, 7),
      Home: () => startOfWeek(focusIso, weekStartsOn),
      End: () => endOfWeek(focusIso, weekStartsOn),
      PageUp: () => (event.shiftKey ? addYears(focusIso, -1) : addMonths(focusIso, -1)),
      PageDown: () => (event.shiftKey ? addYears(focusIso, 1) : addMonths(focusIso, 1)),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    moveTo(move(), true);
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) onClose();
  }

  const monthHasDays = (month: number) => {
    const start = toIso({ year: viewYear, month, day: 1 });
    return !((max && start > max) || (min && endOfMonth(start) < min));
  };

  return (
    <dialog
      ref={dialogRef}
      className="av-date-popup"
      aria-label={`Choose ${label}`}
      data-lenis-prevent=""
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        // Handle Escape directly rather than relying on each browser's dialog close-request rules.
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      onClose={() => {
        // Browsers may close the dialog themselves (e.g. a repeated Escape); keep React state in step.
        if (!dialogRef.current?.open) onClose();
      }}
      onClick={handleBackdropClick}
    >
      <div className="av-calendar">
        <div className="av-calendar__header">
          <button
            type="button"
            className="av-calendar__nav"
            aria-label="Previous month"
            disabled={prevDisabled}
            onClick={() => moveTo(addMonths(focusIso, -1))}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <div className="av-calendar__selects">
            <select
              className="av-calendar__select"
              aria-label="Month"
              value={viewMonth}
              onChange={(event) => moveTo(addMonths(focusIso, Number(event.target.value) - viewMonth))}
            >
              {labels.months.map((monthName, index) => (
                <option key={monthName} value={index + 1} disabled={!monthHasDays(index + 1)}>
                  {monthName}
                </option>
              ))}
            </select>
            <select
              className="av-calendar__select"
              aria-label="Year"
              value={viewYear}
              onChange={(event) => moveTo(addYears(focusIso, Number(event.target.value) - viewYear))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="av-calendar__nav"
            aria-label="Next month"
            disabled={nextDisabled}
            onClick={() => moveTo(addMonths(focusIso, 1))}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
        <p id={headingId} className="av-sr-only" aria-live="polite">
          {labels.monthYear(viewYear, viewMonth)}
        </p>
        <table ref={gridRef} className="av-calendar__grid" role="grid" aria-labelledby={headingId} onKeyDown={handleGridKeyDown}>
          <thead>
            <tr>
              {weekdays.map((weekday) => (
                <th key={weekday} scope="col" abbr={labels.weekdaysLong[weekday]}>
                  {labels.weekdaysShort[weekday]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((week, weekIndex) => (
              <tr key={weekIndex} aria-hidden={week.every((cell) => cell === null) || undefined}>
                {week.map((iso, column) =>
                  iso ? (
                    <td key={iso} role="gridcell" aria-selected={iso === value}>
                      <button
                        type="button"
                        className="av-calendar__day"
                        tabIndex={iso === focusIso ? 0 : -1}
                        disabled={isOutOfRange(iso, min, max)}
                        aria-label={labels.fullDate(iso)}
                        aria-current={iso === today ? "date" : undefined}
                        data-selected={iso === value || undefined}
                        onClick={() => onSelect(iso)}
                      >
                        {Number(iso.slice(8))}
                      </button>
                    </td>
                  ) : (
                    <td key={`empty-${column}`} />
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="av-calendar__footer">
          <Button variant="ghost" size="sm" disabled={isOutOfRange(today, min, max)} onClick={() => onSelect(today)}>
            Today
          </Button>
          <div className="av-calendar__footer-end">
            {value && (
              <Button variant="ghost" size="sm" onClick={() => onSelect("")}>
                Clear
              </Button>
            )}
            <Button variant="secondary" size="sm" className="av-calendar__close" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
