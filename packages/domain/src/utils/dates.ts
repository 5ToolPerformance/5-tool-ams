export type DateFormat =
  | "full"
  | "short"
  | "date"
  | "time"
  | "iso"
  | "relative";
export type Timezone = "local" | "utc";

export interface FormatOptions {
  format?: DateFormat;
  timezone?: Timezone;
  locale?: string;
}

/**
 * Converts a NeonDB timestamp to a readable text format
 * @param timestamp - The timestamp from NeonDB (string, Date, or number)
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatNeonTimestamp(
  timestamp: string | Date | number,
  options: FormatOptions = {}
): string {
  // Handle different timestamp formats from NeonDB
  let date: Date;

  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else if (typeof timestamp === "number") {
    // Handle Unix timestamp (seconds or milliseconds)
    date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
  } else {
    throw new Error("Invalid timestamp format");
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid timestamp value");
  }

  const { format = "full", timezone = "local", locale = "en-US" } = options;

  switch (format) {
    case "full":
      return date.toLocaleString(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });

    case "short":
      return date.toLocaleString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    case "date":
      return date.toLocaleDateString(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    case "time":
      return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    case "iso":
      return timezone === "utc"
        ? date.toISOString()
        : date.toISOString().replace("Z", "");

    case "relative":
      return getRelativeTime(date);

    default:
      return date.toString();
  }
}

/**
 * Returns a relative time string (e.g., "2 hours ago", "just now")
 * @param date - The date to compare with current time
 * @returns Relative time string
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString();
}

/**
 * Quick format functions for common use cases
 */
export const formatDateShort = (timestamp: string | Date | number) =>
  formatNeonTimestamp(timestamp, { format: "short" });

export const formatDateOnly = (timestamp: string | Date | number) =>
  formatNeonTimestamp(timestamp, { format: "date" });

export const formatTimeOnly = (timestamp: string | Date | number) =>
  formatNeonTimestamp(timestamp, { format: "time" });

export const formatRelative = (timestamp: string | Date | number) =>
  formatNeonTimestamp(timestamp, { format: "relative" });

/**
 * Check if a timestamp is from today
 * @param timestamp - The timestamp to check
 * @returns boolean indicating if the date is today
 */
export function isToday(timestamp: string | Date | number): boolean {
  const date = new Date(timestamp);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a timestamp is from this week
 * @param timestamp - The timestamp to check
 * @returns boolean indicating if the date is this week
 */
export function isThisWeek(timestamp: string | Date | number): boolean {
  const date = new Date(timestamp);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
}

/**
 * Calculate age in years from a date of birth.
 * Safe for server + client usage.
 */
export function calculateAge(dob: string | Date): number {
  const birthDate = typeof dob === "string" ? new Date(dob) : dob;

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}
