import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetSites } from "../api/admin/sites";
import { DEFAULT_EVENT_LIMIT } from "../app/settings/subscription/utils/constants";
import { Button } from "./ui/button";

export function FreePlanBanner() {
  const { data: sites } = useGetSites();
  const pathname = usePathname();
  const site = sites?.find(
    (site) => site.siteId === Number(pathname.split("/")[1])
  );

  if (!site) return null;

  // Format numbers with commas
  const formatNumber = (num: number = 0) => {
    return num.toLocaleString();
  };

  if (site.eventLimit === DEFAULT_EVENT_LIMIT) {
    return (
      <div className="mt-4 px-4 py-3 rounded-lg border border-blue-100 dark:border-blue-400/30 bg-blue-50/80 dark:bg-blue-900/20 text-sm flex gap-4 items-center">
        <div className="text-blue-700 dark:text-blue-300 flex items-center font-medium">
          <span>
            Free plan: Using{" "}
            <strong>{formatNumber(site.monthlyEventCount)}</strong> of{" "}
            {formatNumber(site.eventLimit)} events
          </span>
        </div>
        <Button variant="success" size="sm" asChild>
          <Link href="/subscribe">
            Upgrade <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>
    );
  }

  return null;
}
