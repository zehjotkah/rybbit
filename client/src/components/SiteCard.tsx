import { useGetOverview, useGetOverviewBucketed } from "@/hooks/api";
import Link from "next/link";
import { SiteSessionChart } from "./SiteSessionChart";
import { SiteSettings } from "./SiteSettings/SiteSettings";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { ArrowRight } from "lucide-react";

interface SiteCardProps {
  siteId: number;
  domain: string;
}

export function SiteCard({ siteId, domain }: SiteCardProps) {
  const { data, isLoading } = useGetOverviewBucketed({
    past24Hours: true,
    site: siteId,
  });

  const { data: overviewData, isLoading: isOverviewLoading } = useGetOverview({
    site: siteId,
    past24Hours: true,
  });

  if (isLoading || isOverviewLoading) {
    return (
      <div className="flex flex-col rounded-lg bg-neutral-900 p-4" key={siteId}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-2 items-center">
            <img
              className="w-6 mr-1"
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=48`}
              alt={domain}
            />
            <span className="text-lg font-semibold truncate">{domain}</span>
          </div>
        </div>
        <Skeleton className="h-[100px] w-full bg-neutral-950 mb-3" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-12 bg-neutral-800" />
          <Skeleton className="h-12 bg-neutral-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg bg-neutral-900 p-4">
      <div className="flex justify-between items-center mb-3">
        <Link href={`/${siteId}`} className="hover:underline">
          <div className="flex gap-2 items-center">
            <img
              className="w-6 mr-1"
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=48`}
              alt={domain}
            />
            <span className="text-lg font-semibold truncate">{domain}</span>
          </div>
        </Link>
        <SiteSettings siteId={siteId} />
      </div>
      <div className="mt-2">
        <SiteSessionChart data={data?.data ?? []} height={100} />
      </div>
      <div className="flex gap-2 justify-between items-center mt-3 text-sm mx-2">
        <div className="flex flex-col gap-1 items-center">
          <div className="text-gray-400">Sessions</div>
          <div className="font-semibold">
            {overviewData?.data?.sessions?.toLocaleString()}
          </div>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="text-gray-400 ">Users</div>
          <div className="font-semibold">
            {overviewData?.data?.users?.toLocaleString()}
          </div>
        </div>
        <Link href={`/${siteId}`}>
          <Button variant="outline" size="sm">
            Analytics
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
