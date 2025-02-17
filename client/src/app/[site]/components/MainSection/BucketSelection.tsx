"use client";

import { Time, useStore } from "@/lib/store";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTime } from "luxon";

const getOptions = (time: Time) => {
  if (time.mode === "day") {
    return (
      <SelectContent>
        <SelectItem size="sm" value="hour">
          Hour
        </SelectItem>
      </SelectContent>
    );
  }
  if (time.mode === "week") {
    return (
      <SelectContent>
        <SelectItem size="sm" value="hour">
          Hour
        </SelectItem>
        <SelectItem size="sm" value="day">
          Day
        </SelectItem>
      </SelectContent>
    );
  }
  if (time.mode === "month") {
    return (
      <SelectContent>
        <SelectItem size="sm" value="day">
          Day
        </SelectItem>
        <SelectItem size="sm" value="week">
          Week
        </SelectItem>
      </SelectContent>
    );
  }
  if (time.mode === "range") {
    const timeRangeLength = DateTime.fromISO(time.endDate).diff(
      DateTime.fromISO(time.startDate),
      "days"
    ).days;

    return (
      <SelectContent>
        {timeRangeLength <= 7 && (
          <SelectItem size="sm" value="hour">
            Hour
          </SelectItem>
        )}
        {timeRangeLength <= 31 && timeRangeLength > 1 && (
          <SelectItem size="sm" value="day">
            Day
          </SelectItem>
        )}
        {timeRangeLength >= 28 && timeRangeLength <= 180 && (
          <SelectItem size="sm" value="week">
            Week
          </SelectItem>
        )}
        {timeRangeLength >= 60 && timeRangeLength <= 365 && (
          <SelectItem size="sm" value="month">
            Month
          </SelectItem>
        )}
      </SelectContent>
    );
  }
};

export function BucketSelection() {
  const { bucket, setBucket, time } = useStore();

  return (
    <Select value={bucket} onValueChange={setBucket}>
      <SelectTrigger className="w-[120px]" size="sm">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      {getOptions(time)}
    </Select>
  );
}
