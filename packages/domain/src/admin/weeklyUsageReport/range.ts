const REPORT_TIMEZONE = "America/New_York";

type ZonedDateParts = {
  year: number;
  month: number;
  day: number;
  weekday: number;
};

export interface WeeklyUsageReportRange {
  timezone: string;
  weekStart: Date;
  weekEnd: Date;
  queryStart: Date;
  queryEndExclusive: Date;
  label: string;
}

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: REPORT_TIMEZONE,
  weekday: "short",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const labelFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: REPORT_TIMEZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
});

function parseOffsetMinutes(offsetText: string): number {
  if (offsetText === "GMT" || offsetText === "UTC") {
    return 0;
  }

  const match = offsetText.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) {
    throw new Error(`Unsupported timezone offset: ${offsetText}`);
  }

  const [, sign, hoursText, minutesText] = match;
  const hours = Number(hoursText);
  const minutes = Number(minutesText ?? "0");
  const totalMinutes = hours * 60 + minutes;

  return sign === "-" ? -totalMinutes : totalMinutes;
}

function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const offsetFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
    minute: "2-digit",
  });

  const offsetPart = offsetFormatter
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;

  if (!offsetPart) {
    throw new Error(`Unable to determine timezone offset for ${timeZone}`);
  }

  return parseOffsetMinutes(offsetPart);
}

function zonedDateTimeToUtc(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0
) {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  let offsetMinutes = getTimeZoneOffsetMinutes(new Date(utcGuess), timeZone);
  let timestamp = utcGuess - offsetMinutes * 60_000;

  const correctedOffsetMinutes = getTimeZoneOffsetMinutes(new Date(timestamp), timeZone);
  if (correctedOffsetMinutes !== offsetMinutes) {
    offsetMinutes = correctedOffsetMinutes;
    timestamp = utcGuess - offsetMinutes * 60_000;
  }

  return new Date(timestamp);
}

function addUtcDays(year: number, month: number, day: number, daysToAdd: number) {
  const result = new Date(Date.UTC(year, month - 1, day));
  result.setUTCDate(result.getUTCDate() + daysToAdd);

  return {
    year: result.getUTCFullYear(),
    month: result.getUTCMonth() + 1,
    day: result.getUTCDate(),
  };
}

function getZonedDateParts(date: Date): ZonedDateParts {
  const parts = weekdayFormatter.formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  const weekdayText = parts.find((part) => part.type === "weekday")?.value;

  if (!year || !month || !day || !weekdayText) {
    throw new Error("Unable to derive report range date parts.");
  }

  const weekdayMap: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  return {
    year,
    month,
    day,
    weekday: weekdayMap[weekdayText],
  };
}

function formatRangeLabel(start: Date, end: Date) {
  return `${labelFormatter.format(start)} - ${labelFormatter.format(end)}`;
}

export function getWeeklyUsageReportRange(now = new Date()): WeeklyUsageReportRange {
  const zonedToday = getZonedDateParts(now);
  const currentWeekMonday = addUtcDays(
    zonedToday.year,
    zonedToday.month,
    zonedToday.day,
    -(zonedToday.weekday - 1)
  );
  const previousWeekMonday = addUtcDays(
    currentWeekMonday.year,
    currentWeekMonday.month,
    currentWeekMonday.day,
    -7
  );
  const previousWeekSunday = addUtcDays(
    previousWeekMonday.year,
    previousWeekMonday.month,
    previousWeekMonday.day,
    6
  );
  const nextWeekMonday = addUtcDays(
    previousWeekMonday.year,
    previousWeekMonday.month,
    previousWeekMonday.day,
    7
  );

  const queryStart = zonedDateTimeToUtc(
    REPORT_TIMEZONE,
    previousWeekMonday.year,
    previousWeekMonday.month,
    previousWeekMonday.day
  );
  const queryEndExclusive = zonedDateTimeToUtc(
    REPORT_TIMEZONE,
    nextWeekMonday.year,
    nextWeekMonday.month,
    nextWeekMonday.day
  );
  const weekEnd = zonedDateTimeToUtc(
    REPORT_TIMEZONE,
    previousWeekSunday.year,
    previousWeekSunday.month,
    previousWeekSunday.day,
    23,
    59,
    59,
    999
  );

  return {
    timezone: REPORT_TIMEZONE,
    weekStart: queryStart,
    weekEnd,
    queryStart,
    queryEndExclusive,
    label: formatRangeLabel(queryStart, weekEnd),
  };
}
