"use client";
import { ChartBarDecreasing, ChartLine, Radio, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetSites } from "../../../../api/admin/sites";

export function Sidebar() {
  const { data: sites } = useGetSites();
  const pathname = usePathname();

  const site = sites?.find(
    (site) => site.siteId === Number(pathname.split("/")[1])
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
    <div className="w-56 bg-neutral-900 border-r border-neutral-850 h-full flex flex-col">
      {site && (
        <div className="p-4 border-b border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <img
              className="w-6"
              src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}
              alt={site.domain}
            />
            <div className="font-medium text-white truncate">{site.domain}</div>
          </div>
        </div>
      )}
      <div className="flex flex-col space-y-1 p-3 mt-2">
        <SidebarLink
          label="Main"
          active={isActiveTab("main")}
          href={getTabPath("main")}
          icon={<ChartLine size={18} />}
        />
        <SidebarLink
          label="Sessions"
          active={isActiveTab("sessions")}
          href={getTabPath("sessions")}
          icon={<User size={18} />}
        />
        <SidebarLink
          label="Realtime"
          active={isActiveTab("realtime")}
          href={getTabPath("realtime")}
          icon={<Radio size={18} />}
        />
        <SidebarLink
          label="Retention"
          active={isActiveTab("retention")}
          href={getTabPath("retention")}
          icon={<ChartBarDecreasing size={18} />}
        />
        <SidebarLink
          label="Reports"
          active={isActiveTab("reports")}
          href={getTabPath("reports")}
          icon={<ChartBarDecreasing size={18} />}
        />
      </div>
    </div>
  );
}

// Sidebar Link component
function SidebarLink({
  label,
  active = false,
  href,
  icon,
}: {
  label: string;
  active?: boolean;
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link href={href} className="focus:outline-none">
      <div
        className={`px-3 py-2.5 rounded-lg transition-colors w-full ${
          active
            ? "bg-neutral-800 text-white"
            : "text-neutral-200 hover:text-white hover:bg-neutral-800/50"
        }`}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm">{label}</span>
        </div>
      </div>
    </Link>
  );
}
