"use client";
import { Circle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { goBack, goForward } from "@/lib/timeSelectionStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateSelector } from "./DateSelector";

export function Header() {
  const { data } = useQuery<{ count: number }>({
    queryKey: ["active-sessions"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/live-user-count`).then(
        (res) => res.json()
      ),
  });

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
          <Button variant="default" size="icon" onClick={goBack}>
            <ChevronLeft />
          </Button>
          <Button variant="default" size="icon" onClick={goForward}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
