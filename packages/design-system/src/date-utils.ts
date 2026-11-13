// Calendar-date helpers for DateField.
//
// Dates are plain "YYYY-MM-DD" strings (years 1000-9999). They are never run through
// `new Date("YYYY-MM-DD")`, which parses as UTC and lands on the previous day for anyone
// west of Greenwich. All arithmetic uses integer day numbers, so results can't depend on
// the viewer's time zone or daylight-saving changes.

export const MIN_YEAR = 1000;
export const MAX_YEAR = 9999;
export const MIN_ISO = "1000-01-01";
export const MAX_ISO = "9999-12-31";

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type DatePart = "day" | "month" | "year";

export interface CalendarDate {
  year: number;
  /** 1-12 */
  month: number;
  day: number;
}

export interface DateFormat {
  order: DatePart[];
  separator: string;
}

export type ParsedDateInput = { kind: "empty" } | { kind: "valid"; iso: string } | { kind: "invalid" };

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const FALLBACK_LOCALE = "en-US";
const ISO_ORDER: DatePart[] = ["year", "month", "day"];

const pad = (value: number, length: number) => String(value).padStart(length, "0");

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  return month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1];
}

export function isValidDate(year: number, month: number, day: number): boolean {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    year >= MIN_YEAR &&
    year <= MAX_YEAR &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

export function toIso({ year, month, day }: CalendarDate): string {
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

export function parseIso(value: unknown): CalendarDate | null {
  if (typeof value !== "string") return null;
  const match = ISO_PATTERN.exec(value);
  if (!match) return null;
  const date = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  return isValidDate(date.year, date.month, date.day) ? date : null;
}

export function isIso(value: unknown): value is string {
  return parseIso(value) !== null;
}

// Days since 1970-01-01 (proleptic Gregorian). Integer-only civil-calendar algorithms
// from Howard Hinnant's "chrono-compatible low-level date algorithms".
export function toEpochDay({ year, month, day }: CalendarDate): number {
  const shiftedYear = month <= 2 ? year - 1 : year;
  const era = Math.floor(shiftedYear / 400);
  const yearOfEra = shiftedYear - era * 400;
  const dayOfYear = Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const dayOfEra = yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * 146097 + dayOfEra - 719468;
}

export function fromEpochDay(epochDay: number): CalendarDate {
  const shifted = epochDay + 719468;
  const era = Math.floor(shifted / 146097);
  const dayOfEra = shifted - era * 146097;
  const yearOfEra = Math.floor(
    (dayOfEra - Math.floor(dayOfEra / 1460) + Math.floor(dayOfEra / 36524) - Math.floor(dayOfEra / 146096)) / 365,
  );
  const dayOfYear = dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const monthIndex = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * monthIndex + 2) / 5) + 1;
  const month = monthIndex < 10 ? monthIndex + 3 : monthIndex - 9;
  return { year: yearOfEra + era * 400 + (month <= 2 ? 1 : 0), month, day };
}

const MIN_EPOCH_DAY = toEpochDay({ year: MIN_YEAR, month: 1, day: 1 });
const MAX_EPOCH_DAY = toEpochDay({ year: MAX_YEAR, month: 12, day: 31 });

function isoFromEpochDay(epochDay: number): string {
  if (epochDay <= MIN_EPOCH_DAY) return MIN_ISO;
  if (epochDay >= MAX_EPOCH_DAY) return MAX_ISO;
  return toIso(fromEpochDay(epochDay));
}

/** 0 = Sunday … 6 = Saturday */
export function weekdayOf(iso: string): number {
  const date = parseIso(iso);
  if (!date) return 0;
  return (((toEpochDay(date) + 4) % 7) + 7) % 7;
}

export function addDays(iso: string, days: number): string {
  const date = parseIso(iso);
  if (!date || !Number.isFinite(days)) return iso;
  return isoFromEpochDay(toEpochDay(date) + Math.trunc(days));
}

/** Adds calendar months and keeps the day when it exists, otherwise uses the month's last day (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(iso: string, months: number): string {
  const date = parseIso(iso);
  if (!date || !Number.isFinite(months)) return iso;
  const total = date.year * 12 + (date.month - 1) + Math.trunc(months);
  const year = Math.floor(total / 12);
  if (year < MIN_YEAR) return MIN_ISO;
  if (year > MAX_YEAR) return MAX_ISO;
  const month = (((total % 12) + 12) % 12) + 1;
  return toIso({ year, month, day: Math.min(date.day, daysInMonth(year, month)) });
}

export function addYears(iso: string, years: number): string {
  return addMonths(iso, years * 12);
}

export function startOfMonth(iso: string): string {
  const date = parseIso(iso);
  return date ? toIso({ ...date, day: 1 }) : iso;
}

export function endOfMonth(iso: string): string {
  const date = parseIso(iso);
  return date ? toIso({ ...date, day: daysInMonth(date.year, date.month) }) : iso;
}

export function startOfWeek(iso: string, weekStartsOn: WeekStart): string {
  return addDays(iso, -((weekdayOf(iso) - weekStartsOn + 7) % 7));
}

export function endOfWeek(iso: string, weekStartsOn: WeekStart): string {
  return addDays(iso, 6 - ((weekdayOf(iso) - weekStartsOn + 7) % 7));
}

export function isOutOfRange(iso: string, min?: string, max?: string): boolean {
  return (!!min && iso < min) || (!!max && iso > max);
}

export function clampIso(iso: string, min?: string, max?: string): string {
  if (max && iso > max) return max;
  if (min && iso < min) return min;
  return iso;
}

/** Six weeks of cells for the month; days outside the month are `null`. */
export function getMonthGrid(year: number, month: number, weekStartsOn: WeekStart): Array<Array<string | null>> {
  const leading = (weekdayOf(toIso({ year, month, day: 1 })) - weekStartsOn + 7) % 7;
  const total = daysInMonth(year, month);
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, column) => {
      const day = week * 7 + column - leading + 1;
      return day >= 1 && day <= total ? toIso({ year, month, day }) : null;
    }),
  );
}

/** The viewer's local calendar date. */
export function todayIso(now: Date = new Date()): string {
  const year = Math.min(Math.max(now.getFullYear(), MIN_YEAR), MAX_YEAR);
  return toIso({ year, month: now.getMonth() + 1, day: now.getDate() });
}

const formatCache = new Map<string, DateFormat>();

// Works out the field order and separator that locale uses for numeric dates.
// Only the order and separator are taken from Intl; digits are always written as 0-9.
export function getDateFormat(locale: string): DateFormat {
  const cached = formatCache.get(locale);
  if (cached) return cached;

  let format: DateFormat = { order: ["month", "day", "year"], separator: "/" };
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      calendar: "gregory",
      numberingSystem: "latn",
      timeZone: "UTC",
    }).formatToParts(Date.UTC(2006, 10, 22));
    const order = parts
      .filter((part): part is Intl.DateTimeFormatPart & { type: DatePart } => ["day", "month", "year"].includes(part.type))
      .map((part) => part.type);
    const separator = parts.find((part) => part.type === "literal" && /[./-]/.test(part.value))?.value.match(/[./-]/)?.[0];
    if (order.length === 3 && new Set(order).size === 3) format = { order, separator: separator ?? "/" };
  } catch {
    // Malformed locale tags keep the en-US format.
  }

  formatCache.set(locale, format);
  return format;
}

export function formatDate(iso: string, format: DateFormat): string {
  const date = parseIso(iso);
  if (!date) return "";
  const fields: Record<DatePart, string> = { day: pad(date.day, 2), month: pad(date.month, 2), year: pad(date.year, 4) };
  return format.order.map((part) => fields[part]).join(format.separator);
}

export function formatPlaceholder(format: DateFormat): string {
  const letters: Record<DatePart, string> = { day: "DD", month: "MM", year: "YYYY" };
  return format.order.map((part) => letters[part]).join(format.separator);
}

function dateFromFields(fields: Record<DatePart, string>): ParsedDateInput {
  if (fields.year.length !== 4 || fields.month.length > 2 || fields.day.length > 2) return { kind: "invalid" };
  const date = { year: Number(fields.year), month: Number(fields.month), day: Number(fields.day) };
  return isValidDate(date.year, date.month, date.day) ? { kind: "valid", iso: toIso(date) } : { kind: "invalid" };
}

function fieldsFromGroups(groups: string[], order: DatePart[]): Record<DatePart, string> {
  const fields: Record<DatePart, string> = { day: "", month: "", year: "" };
  order.forEach((part, index) => {
    fields[part] = groups[index] ?? "";
  });
  return fields;
}

/**
 * Reads typed text strictly: three numeric groups in the locale's order separated by anything
 * non-numeric ("11/12/2026", "11.12.2026"), ISO ("2026-11-12"), or eight digits in a row.
 * Two-digit years and impossible dates such as Feb 30 are rejected.
 */
export function parseDateInput(text: string, format: DateFormat): ParsedDateInput {
  const value = text.trim();
  if (!value) return { kind: "empty" };

  const separated = /^(\d{1,4})[\s./-]+(\d{1,4})[\s./-]+(\d{1,4})[\s./-]*$/.exec(value);
  if (separated) {
    const groups = [separated[1], separated[2], separated[3]];
    // A leading four-digit group can only be a year, whatever the locale's order is.
    return dateFromFields(fieldsFromGroups(groups, groups[0].length === 4 ? ISO_ORDER : format.order));
  }

  if (/^\d{8}$/.test(value)) {
    const lengths = format.order.map((part) => (part === "year" ? 4 : 2));
    const groups = [
      value.slice(0, lengths[0]),
      value.slice(lengths[0], lengths[0] + lengths[1]),
      value.slice(lengths[0] + lengths[1]),
    ];
    const local = dateFromFields(fieldsFromGroups(groups, format.order));
    if (local.kind === "valid") return local;
    return dateFromFields(fieldsFromGroups([value.slice(0, 4), value.slice(4, 6), value.slice(6)], ISO_ORDER));
  }

  return { kind: "invalid" };
}

export interface DateLabels {
  /** January first. */
  months: string[];
  /** Sunday first. */
  weekdaysShort: string[];
  weekdaysLong: string[];
  monthYear: (year: number, month: number) => string;
  fullDate: (iso: string) => string;
}

const labelCache = new Map<string, DateLabels>();

function createFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, { calendar: "gregory", numberingSystem: "latn", timeZone: "UTC", ...options });
}

function buildLabels(locale: string): DateLabels {
  const monthName = createFormatter(locale, { month: "long" });
  const weekdayShort = createFormatter(locale, { weekday: "short" });
  const weekdayLong = createFormatter(locale, { weekday: "long" });
  const monthYear = createFormatter(locale, { month: "long", year: "numeric" });
  const fullDate = createFormatter(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  // 2023-01-01 was a Sunday.
  const weekdays = (formatter: Intl.DateTimeFormat) =>
    Array.from({ length: 7 }, (_, index) => formatter.format(Date.UTC(2023, 0, 1 + index)));

  return {
    months: Array.from({ length: 12 }, (_, index) => monthName.format(Date.UTC(2023, index, 15))),
    weekdaysShort: weekdays(weekdayShort),
    weekdaysLong: weekdays(weekdayLong),
    monthYear: (year, month) => monthYear.format(Date.UTC(year, month - 1, 1)),
    fullDate: (iso) => {
      const date = parseIso(iso);
      return date ? fullDate.format(Date.UTC(date.year, date.month - 1, date.day)) : "";
    },
  };
}

export function getDateLabels(locale: string): DateLabels {
  const cached = labelCache.get(locale);
  if (cached) return cached;

  let labels: DateLabels;
  try {
    labels = buildLabels(locale);
  } catch {
    labels = labelCache.get(FALLBACK_LOCALE) ?? buildLabels(FALLBACK_LOCALE);
  }

  labelCache.set(locale, labels);
  return labels;
}
