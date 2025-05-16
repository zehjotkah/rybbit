import { Duration, DurationLikeObject, Settings } from "luxon";

// Detect user locale from the browser environment (fallback to 'en-US' on server)
export const userLocale = typeof navigator !== "undefined" ? navigator.language : "en-US";

// Detect whether the user prefers 12-hour time format (true = 12h, false = 24h)
const resolved = new Intl.DateTimeFormat(userLocale, { hour: "numeric" }).resolvedOptions();
export const hour12 = resolved.hourCycle === "h12";

// Detect user's timezone (not exported but used internally)
export const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Set default locale for Luxon globally
Settings.defaultLocale = userLocale;

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

  const keys: (keyof DurationLikeObject)[] = [];
  if (minutes > 0) {
    keys.push("minutes");
  }
  keys.push("seconds");

  const duration = Duration.fromObject(units)
  .shiftTo(...keys)
  .normalize();

  return duration.toHuman({
    listStyle: "narrow",
    unitDisplay: "short",
  });
}




/**
 * Formats a given hour and minute into a localized time string,
 * respecting either 24-hour or 12-hour format based on the `hour12` flag.
 *
 * @param hour - The hour of the day (0–23).
 * @param minute - The minute of the hour (0–59).
 * @returns A localized time string, e.g., "11:00 AM" or "23:00".
 */
export const formatLocalTime = (hour: number, minute: number): string => {
  // Create a DateTimeFormat instance with local settings:
  // - hour: numeric (e.g., 1, 12, 23)
  // - minute: 2-digit (e.g., 00, 59)
  // - hour12: true for 12-hour format, false for 24-hour format
  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: hour12,
  });

  // Create a new Date object set to the given hour and minute
  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  // Format the date to a localized time string
  return formatter.format(date);
};



// localized full day names
// e.g., "Monday" "Tuesday" "Wednesday"
export const longDayNames:string[] = getLocalizedWeekdayNames(userLocale, "long");

// localized short day names
// e.g., "Mon" "Tue" "Wed"
export const shortDayNames:string[] = getLocalizedWeekdayNames(userLocale, "short");

// localized time (hour witout minutes) labels
// e.g., "00" "01" "02"
export const hourLabels: string[] = getLocalizedTimeLabels(userLocale, {
  hour: "numeric",
  hour12: hour12,
});

// localized time (hour with minutes) labels
// e.g., "00:00" "01:00" "02:00"
export const hourMinuteLabels: string[] = getLocalizedTimeLabels(userLocale, {
  hour: "numeric",
  minute: "2-digit",
  hour12: hour12,
});
