"use client";
import { Circle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { goBack, goForward, useTimeSelection } from "@/lib/timeSelectionStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateSelector } from "./DateSelector";

export function Header() {
  const { data } = useQuery<{ count: number }>({
    queryKey: ["active-sessions"],
    queryFn: () =>
      fetch(`${process.env.BACKEND_URL}/live-user-count`).then((res) =>
        res.json()
      ),
  });
  const { time, setTime } = useTimeSelection();

  const DATE_OPTIONS = [
    { value: 1, label: "Today" },
    { value: 7, label: "Last 7 days" },
    { value: 30, label: "Last 30 days" },
    { value: 90, label: "Last 3 months" },
  ];

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex gap-3">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div>Tomato.gg</div>
        </div>
        <div className="flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400">
          <Circle size={12} weight="fill" color="hsl(var(--green-500))" />
          {data?.count} users online
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DateSelector />
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={goBack}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={goForward}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
