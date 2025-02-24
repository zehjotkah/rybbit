"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStore } from "../../../../lib/store";

export function CustomDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const { setTime } = useStore();

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"ghost"}
            className={cn("justify-start text-left font-normal px-2")}
          >
            Custom Range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 " align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              setDate(range);
              if (!range) return;
              if (range?.to) {
                setTime({
                  mode: "range",
                  startDate: range?.from?.toISOString().split("T")[0] ?? "",
                  endDate: range?.to?.toISOString().split("T")[0] ?? "",
                });
              } else {
                setTime({
                  mode: "day",
                  day: range?.from?.toISOString().split("T")[0] ?? "",
                });
              }
            }}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
