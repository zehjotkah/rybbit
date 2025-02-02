import { Time } from "@/lib/timeSelectionStore";

export function getStartAndEndDate(time: Time) {
  if (time.mode === "range") {
    return { startDate: time.startDate, endDate: time.endDate };
  }
  if (time.mode === "month") {
    return { startDate: time.month, endDate: time.month };
  }
  if (time.mode === "year") {
    return { startDate: time.year, endDate: time.year };
  }
  return { startDate: time.date, endDate: time.date };
}
