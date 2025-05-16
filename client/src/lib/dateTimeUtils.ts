
import { Duration, DateTime } from "luxon";

/**
 * Returns localized weekday names, starting from Monday.
 *
 * @param locale - The locale to use (e.g., "en-US", "uk-UA").
 * @param format - The weekday format: "narrow" | "short" | "long".
 * @returns An array of localized weekday names from Monday to Sunday.
 */
export function getLocalizedWeekdayNames(
  locale: string,
  format: "narrow" | "short" | "long" = "long"
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });

  const fallback: Record<"narrow" | "short" | "long", string[]> = {
    narrow: ["M", "T", "W", "T", "F", "S", "S"],
    short: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    long: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  };

  const today = new Date();
  const startDay = 1; // Monday

  return Array.from({ length: 7 }, (_, i) => {
    const day = startDay + i;
    const date = new Date(today);
    date.setDate(today.getDate() + ((day - today.getDay() + 7) % 7));

    const formattedParts = formatter.formatToParts(date);
    const weekdayPart = formattedParts.find((part) => part.type === "weekday");

    return weekdayPart?.value ?? fallback[format][i];
  });
}

/**
 * Returns a list of 24 localized hour labels (e.g., "0", "12 AM", "1 PM")
 * based on the given locale and formatting options.
 *
 * @param locale - The locale to use (e.g., "en-US", "uk-UA").
 * @param options - Intl.DateTimeFormat options (e.g., { hour: "numeric", hour12: true }).
 * @returns An array of 24 formatted hour strings.
 */
export function getLocalizedTimeLabels(
  locale: string,
  options: Intl.DateTimeFormatOptions
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, options);

  return Array.from({ length: 24 }, (_, hour) => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0); // hour:00:00.000
    return formatter.format(date);
  });
}

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

// localized full day names
// e.g., "Monday" "Tuesday" "Wednesday"
export const longDayNames:string[] = getLocalizedWeekdayNames(userLocale, "long");

// localized short day names
// e.g., "Mon" "Tue" "Wed"
export const shortDayNames:string[] = getLocalizedWeekdayNames(userLocale, "short");

// localized time (hour with minutes) labels
// e.g., "00" "01" "02"
export const hourLabels: string[] = getLocalizedTimeLabels(userLocale, {
  hour: "numeric",
  hour12: !is24Hour,
});

// localized time (hour with minutes) labels
// e.g., "00:00" "01:00" "02:00"
export const hourMinuteLabels: string[] = getLocalizedTimeLabels(userLocale, {
  hour: "numeric",
  minute: "2-digit",
  hour12: !is24Hour,
});
