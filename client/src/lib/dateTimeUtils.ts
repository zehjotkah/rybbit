
import { Duration, DateTime } from "luxon";

/**
 * Formats a duration given in minutes and seconds into a human-readable string.
 *
 * Uses `luxon.Duration` to normalize and format the result, omitting zero units
 * and showing the output in a compact style (e.g., "1 min 30 sec").
 *
 * @param minutes - Number of minutes.
 * @param seconds - Number of seconds.
 * @returns A human-readable duration string.
 */
export function formatDuration(minutes: number, seconds: number): string {
  const units: Record<string, number> = {};

  if (minutes > 0) {
    units.minutes = minutes;
  }

  // Always show seconds if minutes is zero or seconds > 0
  if (seconds > 0 || minutes === 0) {
    units.seconds = seconds;
  }

  const duration = Duration.fromObject(units)
    .shiftTo("minutes", "seconds")
    .normalize();

  return duration.toHuman({
    listStyle: "narrow",
    unitDisplay: "short",
  });
}

/**
 * Formats a Luxon DateTime object using a locale-aware format string.
 *
 * Internally sets the locale of the DateTime object to the detected user locale
 * before formatting, ensuring the output reflects local conventions (e.g., month names, weekdays).
 *
 * @param dateTime - A Luxon DateTime instance to format.
 * @param format - A Luxon-compatible format string (e.g., "yyyy-MM-dd", "HH:mm", "ccc").
 * @returns The formatted date/time string according to the user's locale.
 */
export function localeFormat(dateTime: DateTime, format: string): string {
  return dateTime.setLocale(userLocale).toFormat(format);
}




// Detect user locale
export const userLocale = typeof navigator !== "undefined" ? navigator.language : "en";

// Detect user 12h/24h preference
const resolved = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions();
export const is24Hour = resolved.hourCycle === "h23" || resolved.hourCycle === "h24";
