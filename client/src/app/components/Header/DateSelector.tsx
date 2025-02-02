"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Time, useTimeSelection } from "@/lib/timeSelectionStore";
import { DateTime } from "luxon";
import { CustomDateRangePicker } from "./CustomDateRangePicker";

const getLabel = (time: Time) => {
  if (time.mode === "range") {
    return `${time.startDate} - ${time.endDate}`;
  }

  if (time.mode === "date") {
    if (time.date === DateTime.now().toISODate()) {
      return "Today";
    }
    if (time.date === DateTime.now().minus({ days: 1 }).toISODate()) {
      return "Yesterday";
    }
    return time.date;
  }
};

export function DateSelector() {
  const { time, setTime } = useTimeSelection();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">{getLabel(time)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            setTime({
              mode: "date",
              date: DateTime.now().toISODate(),
            })
          }
        >
          Today
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            setTime({
              mode: "range",
              startDate: DateTime.now().minus({ days: 7 }).toISODate(),
              endDate: DateTime.now().toISODate(),
            })
          }
        >
          Last 7 Days
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            setTime({
              mode: "range",
              startDate: DateTime.now().minus({ days: 30 }).toISODate(),
              endDate: DateTime.now().toISODate(),
            })
          }
        >
          Last 30 Days
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <CustomDateRangePicker />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
