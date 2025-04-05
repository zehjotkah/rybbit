"use client";
import { usePathname } from "next/navigation";
import { useGetSites } from "../../../../api/admin/sites";
import { SiteSettings } from "../../../../components/SiteSettings/SiteSettings";
import LiveUserCount from "./LiveUserCount";
import { UsageBanners } from "./UsageBanners";

export function Header() {
  const { data: sites } = useGetSites();
  const pathname = usePathname();

  const site = sites?.find(
    (site) => site.siteId === Number(pathname.split("/")[1])
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-2">
        <div className="flex gap-3">
          <div className="flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400">
            <LiveUserCount />
            <SiteSettings siteId={site?.siteId ?? 0} />
          </div>
        </div>
      </div>
      {/* <UsageBanners site={site} /> */}
    </div>
  );
}
