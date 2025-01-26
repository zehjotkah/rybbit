"use client";
import { Circle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomDateRangePicker } from "./CustomDateRangePicker";

const DATE_OPTIONS = [
  { value: "1d", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 3 months" },
];

export function Header() {
  const { data } = useQuery<{ count: number }>({
    queryKey: ["active-sessions"],
    queryFn: () =>
      fetch(`${process.env.BACKEND_URL}/live-user-count`).then((res) =>
        res.json()
      ),
  });
  const { date, setDate } = useStore();

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
        <div className="flex items-center">
          <Button variant="outline" size="icon">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight />
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              {DATE_OPTIONS.find((option) => option.value === date)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {DATE_OPTIONS.map((option) => (
              <DropdownMenuItem
                onClick={() => setDate(option.value)}
                key={option.value}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <CustomDateRangePicker />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
