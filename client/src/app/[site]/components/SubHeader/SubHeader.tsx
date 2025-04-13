"use client";
import { Filters } from "./Filters/Filters";

import { Button } from "@/components/ui/button";
import { FilterParameter, goBack, goForward, useStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { DateTime } from "luxon";
import { VisuallyHidden } from "radix-ui";

import { DateSelector } from "../../../../components/DateSelector/DateSelector";
import { Time } from "../../../../components/DateSelector/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet";
import { Sidebar } from "../Sidebar/Sidebar";

const canGoForward = (time: Time) => {
  const currentDay = DateTime.now().startOf("day");
  if (time.mode === "day") {
    return !(DateTime.fromISO(time.day).startOf("day") >= currentDay);
  }

  if (time.mode === "range") {
    return !(DateTime.fromISO(time.endDate).startOf("day") >= currentDay);
  }

  if (time.mode === "week") {
    return !(DateTime.fromISO(time.week).startOf("week") >= currentDay);
  }

  if (time.mode === "month") {
    return !(DateTime.fromISO(time.month).startOf("month") >= currentDay);
  }

  if (time.mode === "year") {
    return !(DateTime.fromISO(time.year).startOf("year") >= currentDay);
  }

  return false;
};

export function SubHeader({
  availableFilters,
}: {
  availableFilters?: FilterParameter[];
}) {
  const { time, setTime } = useStore();

  return (
    <div className="flex gap-2 mb-3 justify-between">
      <div className="flex items-center gap-2">
        <div className=" md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <VisuallyHidden.Root>
              <SheetHeader>
                <SheetTitle>Frogstats Sidebar</SheetTitle>
              </SheetHeader>
            </VisuallyHidden.Root>
            <SheetContent side="left" className="p-0 w-[223px]">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
        <Filters availableFilters={availableFilters} />
      </div>
      <div className="flex items-center gap-2">
        <DateSelector time={time} setTime={setTime} />
        <div className="flex items-center">
          <Button variant="default" size="icon" onClick={goBack}>
            <ChevronLeft />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={goForward}
            disabled={!canGoForward(time)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
