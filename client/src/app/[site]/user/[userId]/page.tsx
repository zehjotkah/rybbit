"use client";

import { UserSessionsResponse, useGetUserSessions } from "@/hooks/api";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Browser } from "../../components/shared/icons/Browser";
import { OperatingSystem } from "../../components/shared/icons/OperatingSystem";
import { CountryFlag } from "../../components/shared/icons/CountryFlag";
import { getCountryName } from "@/lib/utils";
import { useGetSiteMetadata } from "../../../../hooks/hooks";
import { useStore } from "../../../../lib/store";

export default function UserPage() {
  const { userId } = useParams();
  const { data, isLoading, error } = useGetUserSessions(userId as string);
  const { site } = useStore();
  const { siteMetadata, isLoading: isLoadingSiteMetadata } =
    useGetSiteMetadata(site);
  console.info(data);

  // Sessions are now pre-grouped by the server
  const groupedSessions = data?.data || [];

  if (error) {
    return <div className="p-6">Error: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">User Profile: {userId}</h1>
        <div className="text-sm text-gray-400">
          {groupedSessions.length > 0
            ? `${groupedSessions.length} sessions recorded`
            : isLoading
            ? "Loading user data..."
            : "No sessions found for this user"}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6"
            >
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {groupedSessions.map((session: UserSessionsResponse[number]) => (
            <div
              key={session.session_id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  Session from{" "}
                  {format(
                    parseISO(session.firstTimestamp),
                    "MMM d, yyyy h:mm a"
                  )}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Browser browser={session.browser || "Unknown"} />
                    {session.browser || "Unknown"}
                  </div>
                  <div className="flex items-center gap-2">
                    <OperatingSystem
                      os={session.operating_system || "Unknown"}
                    />
                    {session.operating_system || "Unknown"}
                  </div>
                  <div>{session.device_type || "Unknown Device"}</div>
                  <div className="flex items-center gap-2">
                    <CountryFlag country={session.country || "Unknown"} />
                    {getCountryName(session.country || "Unknown")}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-300 mb-2">
                  Pages Viewed:
                </h3>
                {session.pageviews.map(
                  (
                    pageview: {
                      pathname: string;
                      title: string;
                      timestamp: string;
                      referrer: string;
                    },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="pl-4 border-l-2 border-neutral-800"
                    >
                      <div className="text-sm text-gray-400 mb-1">
                        {format(parseISO(pageview.timestamp), "h:mm:ss a")}
                      </div>
                      <div className="font-medium mb-1">
                        <a
                          href={`https://${siteMetadata?.domain}${pageview.pathname}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {pageview.pathname}
                        </a>
                      </div>
                      {pageview.referrer ? (
                        <div className="text-sm text-gray-400">
                          Referrer: {pageview.referrer}
                        </div>
                      ) : null}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
