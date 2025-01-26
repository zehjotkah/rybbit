"use client";
import { Circle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

export function Header() {
  const { data } = useQuery<{ count: number }>({
    queryKey: ["active-sessions"],
    queryFn: () =>
      fetch(`${process.env.BACKEND_URL}/live-user-count`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xl font-bold">
        <div>Tomato.gg</div>
      </div>
      <div className="text-base text-neutral-600 dark:text-neutral-400">
        <Circle size={24} weight="fill" color="#FF6600" />
        {data?.count}
      </div>
    </div>
  );
}
