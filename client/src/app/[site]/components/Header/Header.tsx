"use client";
import { Circle } from "@phosphor-icons/react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { usePathname } from "next/navigation";
import { useGetLiveUsercount, useGetSites } from "../../../../hooks/api";

export function Header() {
  const { data } = useGetLiveUsercount();
  const { time } = useStore();
  const { data: sites } = useGetSites();
  const pathname = usePathname();

  const site = sites?.data?.find(
    (site) => site.site_id === Number(pathname.split("/")[1])
  );

  // Check which tab is active based on the current path
  const getTabPath = (tabName: string) => {
    return `/${pathname.split("/")[1]}/${tabName.toLowerCase()}`;
  };

  const isActiveTab = (tabName: string) => {
    if (!pathname.includes("/")) return false;

    const route = pathname.split("/")[2] || "main";
    return route === tabName.toLowerCase();
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex gap-3">
        <div className="flex items-center gap-2 text-xl font-bold">
          <img
            className="w-7 mr-1"
            src={`https://www.google.com/s2/favicons?domain=${site?.domain}&sz=64`}
          />
          <div>{site?.domain}</div>
        </div>
        <div className="flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400">
          <Circle size={12} weight="fill" color="hsl(var(--green-500))" />
          {data?.count} users online
        </div>
      </div>
      <div className="flex space-x-2">
        <TabButton
          label="Main"
          active={isActiveTab("main")}
          href={getTabPath("main")}
        />
        <TabButton
          label="Sessions"
          active={isActiveTab("sessions")}
          href={getTabPath("sessions")}
        />
        <TabButton
          label="Realtime"
          active={isActiveTab("realtime")}
          href={getTabPath("realtime")}
        />
        <TabButton
          label="Reports"
          active={isActiveTab("reports")}
          href={getTabPath("reports")}
        />
      </div>
    </div>
  );
}

// Tab Button component with navigation
function TabButton({
  label,
  active = false,
  href,
}: {
  label: string;
  active?: boolean;
  href: string;
}) {
  return (
    <Link href={href} className="focus:outline-none">
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          active
            ? "bg-neutral-800 text-white"
            : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
        }`}
      >
        {label}
      </button>
    </Link>
  );
}
