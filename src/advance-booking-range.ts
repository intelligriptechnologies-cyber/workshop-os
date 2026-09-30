export type AdvanceBookingRange = { min: string; max: string; firstMonth: string; lastMonth: string };

const pad = (value: number) => String(value).padStart(2, "0");

function parseMonth(month: string) {
  const [year, value] = month.split("-").map(Number);
  return { year, month: value };
}

/** Shifts a YYYY-MM month without constructing a timezone-sensitive Date. */
export function shiftCalendarMonth(month: string, amount: number) {
  const parsed = parseMonth(month);
  const absoluteMonth = parsed.year * 12 + parsed.month - 1 + amount;
  return `${Math.floor(absoluteMonth / 12)}-${pad((absoluteMonth % 12) + 1)}`;
}

function daysInMonth(month: string) {
  const { year, month: monthNumber } = parseMonth(month);
  if (monthNumber === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(monthNumber) ? 30 : 31;
}

export function localDateOnly(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** The two complete calendar months immediately following the current month. */
export function advanceBookingRange(now = new Date()): AdvanceBookingRange {
  const currentMonth = localDateOnly(now).slice(0, 7);
  const firstMonth = shiftCalendarMonth(currentMonth, 1);
  const lastMonth = shiftCalendarMonth(currentMonth, 2);
  return { min: `${firstMonth}-01`, max: `${lastMonth}-${daysInMonth(lastMonth)}`, firstMonth, lastMonth };
}

export function isAdvanceBookingDate(date: string, range: AdvanceBookingRange) {
  return date >= range.min && date <= range.max;
}

export function clampAdvanceBookingDate(date: string, range: AdvanceBookingRange) {
  if (date < range.min) return range.min;
  if (date > range.max) return range.max;
  return date;
}

export function datesForCalendarMonth(month: string) {
  const { year, month: monthNumber } = parseMonth(month);
  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
  const firstDate = new Date(Date.UTC(year, monthNumber - 1, 1 - firstWeekday));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstDate);
    date.setUTCDate(firstDate.getUTCDate() + index);
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
  });
}
