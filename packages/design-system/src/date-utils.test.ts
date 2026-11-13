import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_ISO,
  MIN_ISO,
  addDays,
  addMonths,
  addYears,
  clampIso,
  daysInMonth,
  endOfMonth,
  endOfWeek,
  formatDate,
  formatPlaceholder,
  fromEpochDay,
  getDateFormat,
  getDateLabels,
  getMonthGrid,
  isOutOfRange,
  parseDateInput,
  parseIso,
  startOfMonth,
  startOfWeek,
  toEpochDay,
  todayIso,
  weekdayOf,
} from "./date-utils.js";

const US = getDateFormat("en-US");

describe("ISO dates", () => {
  it("accepts real calendar dates and rejects impossible or sloppy ones", () => {
    for (const valid of ["2026-02-28", "2024-02-29", "2000-02-29", "1000-01-01", "9999-12-31"]) {
      assert.ok(parseIso(valid), valid);
    }
    for (const invalid of ["2026-02-29", "1900-02-29", "2026-13-01", "2026-00-10", "2026-04-31", "2026-1-5", "0999-12-31", " 2026-01-01", "2026-01-01T00:00", "", "tomorrow"]) {
      assert.equal(parseIso(invalid), null, invalid);
    }
    assert.equal(parseIso(undefined), null);
    assert.equal(parseIso(20260101), null);
  });

  it("knows leap years", () => {
    assert.deepEqual([1900, 2000, 2024, 2026, 2100].map((year) => daysInMonth(year, 2)), [28, 29, 29, 28, 28]);
  });
});

describe("day arithmetic", () => {
  it("matches the platform calendar for every day from year 1000 to 9999", () => {
    const first = toEpochDay({ year: 1000, month: 1, day: 1 });
    const last = toEpochDay({ year: 9999, month: 12, day: 31 });
    for (let epochDay = first; epochDay <= last; epochDay += 1) {
      const date = new Date(epochDay * 86_400_000);
      const expected = { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
      const actual = fromEpochDay(epochDay);
      if (actual.year !== expected.year || actual.month !== expected.month || actual.day !== expected.day) {
        assert.deepEqual(actual, expected, `epoch day ${epochDay}`);
      }
      if (toEpochDay(expected) !== epochDay) assert.equal(toEpochDay(expected), epochDay);
    }
  });

  it("computes weekdays", () => {
    assert.equal(weekdayOf("1970-01-01"), 4);
    assert.equal(weekdayOf("2000-01-01"), 6);
    assert.equal(weekdayOf("2026-11-12"), 4);
    assert.equal(weekdayOf("2024-02-29"), 4);
    assert.equal(weekdayOf("1000-01-01"), 3);
  });

  it("moves across month, year and leap boundaries", () => {
    assert.equal(addDays("2026-01-31", 1), "2026-02-01");
    assert.equal(addDays("2026-01-01", -1), "2025-12-31");
    assert.equal(addDays("2024-02-28", 1), "2024-02-29");
    assert.equal(addDays("2026-02-28", 1), "2026-03-01");
    assert.equal(addDays("2026-11-12", 7), "2026-11-19");
    assert.equal(addDays("2026-11-12", -365), "2025-11-12");
  });

  it("stops at the supported range instead of producing malformed dates", () => {
    assert.equal(addDays("1000-01-02", -5), MIN_ISO);
    assert.equal(addDays("9999-12-30", 5), MAX_ISO);
    assert.equal(addMonths("1000-03-10", -12), MIN_ISO);
    assert.equal(addYears("9999-06-01", 1), MAX_ISO);
  });

  it("clamps the day when the target month is shorter", () => {
    assert.equal(addMonths("2026-01-31", 1), "2026-02-28");
    assert.equal(addMonths("2024-01-31", 1), "2024-02-29");
    assert.equal(addMonths("2026-03-31", -1), "2026-02-28");
    assert.equal(addMonths("2026-10-31", 1), "2026-11-30");
    assert.equal(addMonths("2026-01-15", -1), "2025-12-15");
    assert.equal(addMonths("2026-01-15", 13), "2027-02-15");
    assert.equal(addYears("2024-02-29", 1), "2025-02-28");
    assert.equal(addYears("2024-02-29", 4), "2028-02-29");
  });

  it("finds week and month edges for either week start", () => {
    assert.equal(startOfWeek("2026-11-12", 0), "2026-11-08");
    assert.equal(endOfWeek("2026-11-12", 0), "2026-11-14");
    assert.equal(startOfWeek("2026-11-12", 1), "2026-11-09");
    assert.equal(endOfWeek("2026-11-12", 1), "2026-11-15");
    assert.equal(startOfWeek("2026-11-08", 0), "2026-11-08");
    assert.equal(endOfWeek("2026-11-14", 0), "2026-11-14");
    assert.equal(startOfMonth("2026-11-12"), "2026-11-01");
    assert.equal(endOfMonth("2026-02-10"), "2026-02-28");
    assert.equal(endOfMonth("2024-02-10"), "2024-02-29");
  });
});

describe("min and max", () => {
  it("clamps and detects out-of-range dates", () => {
    assert.equal(clampIso("2025-12-31", "2026-01-01"), "2026-01-01");
    assert.equal(clampIso("2027-01-01", "2026-01-01", "2026-12-31"), "2026-12-31");
    assert.equal(clampIso("2026-06-01", "2026-01-01", "2026-12-31"), "2026-06-01");
    assert.equal(clampIso("2026-06-01"), "2026-06-01");
    assert.equal(isOutOfRange("2026-01-01", "2026-01-01", "2026-12-31"), false);
    assert.equal(isOutOfRange("2025-12-31", "2026-01-01"), true);
    assert.equal(isOutOfRange("2027-01-01", undefined, "2026-12-31"), true);
    assert.equal(isOutOfRange("2027-01-01"), false);
  });
});

describe("month grid", () => {
  it("always has six weeks, with cells outside the month left empty", () => {
    const november = getMonthGrid(2026, 11, 0);
    assert.equal(november.length, 6);
    assert.ok(november.every((week) => week.length === 7));
    assert.deepEqual(november[0], ["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-07"]);
    assert.deepEqual(november[4], ["2026-11-29", "2026-11-30", null, null, null, null, null]);
    assert.ok(november[5].every((cell) => cell === null));
    assert.equal(november.flat().filter(Boolean).length, 30);
  });

  it("shifts the first column with the week start", () => {
    const monday = getMonthGrid(2026, 11, 1);
    assert.deepEqual(monday[0], [null, null, null, null, null, null, "2026-11-01"]);
    assert.equal(monday.flat().filter(Boolean).length, 30);
  });

  it("fits a six-row month and a leap February", () => {
    const august = getMonthGrid(2026, 8, 0);
    assert.equal(august[5][1], "2026-08-31");
    assert.equal(getMonthGrid(2024, 2, 0).flat().filter(Boolean).length, 29);
    assert.equal(getMonthGrid(2026, 2, 0).flat().filter(Boolean).length, 28);
  });
});

describe("today", () => {
  it("uses the viewer's local calendar date, not the UTC date", () => {
    assert.equal(todayIso(new Date(2026, 10, 12, 23, 30)), "2026-11-12");
    assert.equal(todayIso(new Date(2026, 10, 13, 0, 5)), "2026-11-13");
    assert.equal(todayIso(new Date(2026, 0, 1, 0, 0)), "2026-01-01");
  });
});

describe("date format", () => {
  it("reads the field order and separator from the locale", () => {
    assert.deepEqual(getDateFormat("en-US"), { order: ["month", "day", "year"], separator: "/" });
    assert.deepEqual(getDateFormat("en-GB"), { order: ["day", "month", "year"], separator: "/" });
    assert.deepEqual(getDateFormat("de-DE"), { order: ["day", "month", "year"], separator: "." });
    assert.deepEqual(getDateFormat("ja-JP"), { order: ["year", "month", "day"], separator: "/" });
    assert.deepEqual(getDateFormat("sv-SE"), { order: ["year", "month", "day"], separator: "-" });
  });

  it("strips directional marks and falls back to en-US for bad locales", () => {
    assert.equal(getDateFormat("ar-EG").separator, "/");
    assert.deepEqual(getDateFormat("not a locale"), getDateFormat("en-US"));
  });

  it("writes dates and placeholders with Latin digits", () => {
    assert.equal(formatDate("2026-11-05", US), "11/05/2026");
    assert.equal(formatDate("2026-11-05", getDateFormat("de-DE")), "05.11.2026");
    assert.equal(formatDate("2026-11-05", getDateFormat("ja-JP")), "2026/11/05");
    assert.equal(formatDate("not a date", US), "");
    assert.equal(formatPlaceholder(US), "MM/DD/YYYY");
    assert.equal(formatPlaceholder(getDateFormat("de-DE")), "DD.MM.YYYY");
  });
});

describe("typed dates", () => {
  it("accepts the common ways people type a date", () => {
    const cases: Array<[string, string]> = [
      ["11/12/2026", "2026-11-12"],
      ["11-12-2026", "2026-11-12"],
      ["11.12.2026", "2026-11-12"],
      ["11 12 2026", "2026-11-12"],
      [" 11/12/2026 ", "2026-11-12"],
      ["1/5/2026", "2026-01-05"],
      ["11122026", "2026-11-12"],
      ["2026-11-12", "2026-11-12"],
      ["2026/11/12", "2026-11-12"],
      ["20261112", "2026-11-12"],
    ];
    for (const [text, iso] of cases) {
      assert.deepEqual(parseDateInput(text, US), { kind: "valid", iso }, text);
    }
  });

  it("treats blank text as empty", () => {
    assert.deepEqual(parseDateInput("", US), { kind: "empty" });
    assert.deepEqual(parseDateInput("   ", US), { kind: "empty" });
  });

  it("rejects partial, ambiguous and impossible dates", () => {
    for (const text of ["1", "11/12", "11/12/26", "11/12/20266", "13/01/2026", "02/30/2026", "02/29/2026", "00/10/2026", "11/00/2026", "abc", "11/12/2026/1", "11//", "0999-01-01", "99/99/9999", "11/12/0999"]) {
      assert.deepEqual(parseDateInput(text, US), { kind: "invalid" }, text);
    }
  });

  it("follows the locale's field order", () => {
    assert.deepEqual(parseDateInput("12/11/2026", getDateFormat("en-GB")), { kind: "valid", iso: "2026-11-12" });
    assert.deepEqual(parseDateInput("12.11.2026", getDateFormat("de-DE")), { kind: "valid", iso: "2026-11-12" });
    assert.deepEqual(parseDateInput("12112026", getDateFormat("de-DE")), { kind: "valid", iso: "2026-11-12" });
    assert.deepEqual(parseDateInput("2026/11/12", getDateFormat("ja-JP")), { kind: "valid", iso: "2026-11-12" });
    assert.deepEqual(parseDateInput("20261112", getDateFormat("ja-JP")), { kind: "valid", iso: "2026-11-12" });
    assert.deepEqual(parseDateInput("12/11/2026", US), { kind: "valid", iso: "2026-12-11" });
    assert.deepEqual(parseDateInput("25/11/2026", US), { kind: "invalid" });
  });

  it("round-trips everything it formats", () => {
    for (const locale of ["en-US", "en-GB", "de-DE", "ja-JP", "sv-SE", "ko-KR"]) {
      const format = getDateFormat(locale);
      for (const iso of ["2026-01-05", "2024-02-29", "1000-01-01", "9999-12-31", "2026-11-12"]) {
        assert.deepEqual(parseDateInput(formatDate(iso, format), format), { kind: "valid", iso }, `${locale} ${iso}`);
      }
    }
  });
});

describe("labels", () => {
  const en = getDateLabels("en-US");

  it("names months, weekdays and dates without shifting the day", () => {
    assert.equal(en.months[0], "January");
    assert.equal(en.months[11], "December");
    assert.deepEqual(en.weekdaysShort, ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    assert.equal(en.weekdaysLong[4], "Thursday");
    assert.equal(en.monthYear(2026, 11), "November 2026");
    assert.equal(en.fullDate("2026-11-12"), "Thursday, November 12, 2026");
    assert.equal(en.fullDate("2026-01-01"), "Thursday, January 1, 2026");
    assert.equal(en.fullDate("2026-12-31"), "Thursday, December 31, 2026");
    assert.equal(en.fullDate("nope"), "");
  });

  it("localises names and falls back to en-US for bad locales", () => {
    assert.equal(getDateLabels("de-DE").months[2], "März");
    assert.equal(getDateLabels("not a locale").months[0], "January");
  });
});
