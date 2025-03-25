import { useState } from "react";
import { DateTime } from "luxon";
import { Browser } from "../../components/shared/icons/Browser";
import { CountryFlag } from "../../components/shared/icons/CountryFlag";
import { OperatingSystem } from "../../components/shared/icons/OperatingSystem";
import { getCountryName } from "../../../../lib/utils";
import {
  Laptop,
  Smartphone,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Clock,
  Globe,
  MonitorSmartphone,
  Code,
  FileText,
  MousePointerClick,
  ExternalLink,
} from "lucide-react";
import Avatar from "boring-avatars";
import {
  GetSessionsResponse,
  useGetSessionDetails,
  PageviewEvent,
} from "../../../../api/analytics/userSessions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SessionCardProps {
  session: GetSessionsResponse[number];
  onClick?: () => void;
}

// DeviceIcon component for displaying mobile/desktop icons
function DeviceIcon({ deviceType }: { deviceType: string }) {
  const type = deviceType.toLowerCase();

  if (type.includes("mobile") || type.includes("tablet")) {
    return <Smartphone className="w-4 h-4" />;
  }

  return <Laptop className="w-4 h-4" />;
}

// Function to truncate path for display
function truncatePath(path: string, maxLength: number = 32) {
  if (!path) return "-";
  if (path.length <= maxLength) return path;

  // Keep the beginning of the path with ellipsis
  return `${path.substring(0, maxLength)}...`;
}

// Component to display a single pageview or event
function PageviewItem({
  item,
  index,
  isLast = false,
}: {
  item: PageviewEvent;
  index: number;
  isLast?: boolean;
}) {
  const isEvent = item.type !== "pageview";
  const timestamp = DateTime.fromSQL(item.timestamp);
  const formattedTime = timestamp.toFormat("h:mm:ss a");

  return (
    <div className="flex items-center mb-3 last:mb-0">
      {/* Timeline circle with number */}
      <div className="relative flex-shrink-0">
        {!isLast && (
          <div className="absolute top-8 left-4 w-[1px] h-[12px] bg-neutral-700" />
        )}
        {/* Connecting line */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isEvent ? "bg-amber-900/30" : "bg-blue-900/30"
          } border ${isEvent ? "border-amber-500/50" : "border-blue-500/50"}`}
        >
          <span className="text-sm font-medium">{index + 1}</span>
        </div>
      </div>

      {/* Content in a single row */}
      <div className="flex items-center ml-3 flex-1">
        <div className="flex-shrink-0 mr-3">
          {isEvent ? (
            <MousePointerClick className="w-4 h-4 text-amber-500" />
          ) : (
            <FileText className="w-4 h-4 text-blue-500" />
          )}
        </div>

        <div className="flex-1 min-w-0 mr-4">
          <div className="text-sm truncate" title={item.pathname}>
            {item.pathname}
            {item.querystring ? item.querystring : ""}
          </div>
        </div>

        <div className="text-xs text-gray-400 flex-shrink-0">
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

export function SessionCard({ session, onClick }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const {
    data: sessionDetails,
    isLoading,
    error,
  } = useGetSessionDetails(expanded ? session.session_id : null);

  // Calculate session duration in minutes
  const start = DateTime.fromSQL(session.session_start);
  const end = DateTime.fromSQL(session.session_end);
  const duration = end.diff(start, ["minutes", "seconds"]);
  const durationFormatted = `${Math.floor(duration.minutes)}m ${Math.floor(
    duration.seconds
  )}s`;

  // Truncate user ID to first 8 characters
  const truncatedUserId = session.user_id.substring(0, 8);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div className="mb-3 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden">
      <div className="p-3 cursor-pointer" onClick={handleCardClick}>
        <div className="flex items-center gap-2">
          {/* Avatar and User ID */}
          <div className="flex items-center gap-2">
            <Avatar
              name={session.user_id}
              colors={["#2c2b4b", "#a75293", "#9c7a9d", "#9ddacb", "#f8dcb4"]}
              variant="beam"
              size={24}
            />
            <span className="text-xs font-mono text-gray-400">
              {truncatedUserId}
            </span>
          </div>

          {/* Icons section */}
          <div className="flex space-x-2 items-center ml-3">
            {/* Country */}
            {session.country && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <CountryFlag country={session.country} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getCountryName(session.country)}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Browser */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Browser browser={session.browser || "Unknown"} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{session.browser || "Unknown browser"}</p>
              </TooltipContent>
            </Tooltip>

            {/* OS */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <OperatingSystem os={session.operating_system || ""} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{session.operating_system || "Unknown OS"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Device Type */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <DeviceIcon deviceType={session.device_type || ""} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{session.device_type || "Unknown device"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Pages section with tooltips for long paths */}
          <div className="flex items-center ml-3 flex-1 min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-gray-400 truncate max-w-[200px] inline-block">
                  {truncatePath(session.entry_page)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{session.entry_page || "-"}</p>
              </TooltipContent>
            </Tooltip>

            <ArrowRight className="mx-2 w-3 h-3 flex-shrink-0 text-gray-400" />

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-gray-400 truncate max-w-[200px] inline-block">
                  {truncatePath(session.exit_page)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{session.exit_page || "-"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Time information */}
          <div className="flex items-center gap-2 ml-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{durationFormatted}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {DateTime.fromSQL(session.session_start).toFormat(
                    "MMM d, h:mm a"
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Expand/Collapse icon */}
          <div className="ml-3 flex-shrink-0">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded content - detailed session data */}
      {expanded && (
        <div className="px-4 pb-4 bg-neutral-900 border-t border-neutral-800">
          {isLoading ? (
            <div className="py-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                Error loading session details. Please try again.
              </AlertDescription>
            </Alert>
          ) : sessionDetails?.data ? (
            <Tabs defaultValue="timeline" className="mt-4">
              <TabsList className="bg-neutral-800">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="info">Session Info</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="mt-4">
                <div className="mb-3">
                  <div className="text-sm font-medium mb-2">
                    Session Timeline
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-neutral-800 text-gray-300"
                    >
                      <FileText className="w-3 h-3" />
                      <span>
                        Pageviews: {sessionDetails.data.session.pageviews}
                      </span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-neutral-800 text-gray-300"
                    >
                      <MousePointerClick className="w-3 h-3" />
                      <span>
                        Events:{" "}
                        {
                          sessionDetails.data.pageviews.filter(
                            (p) => p.type !== "pageview"
                          ).length
                        }
                      </span>
                    </Badge>
                  </div>
                  <div className="p-4">
                    {sessionDetails.data.pageviews.map((pageview, index) => (
                      <PageviewItem
                        key={`${pageview.timestamp}-${index}`}
                        item={pageview}
                        index={index}
                        isLast={
                          index === sessionDetails.data.pageviews.length - 1
                        }
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="info" className="mt-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      User Information
                    </h4>
                    <div className="space-y-2 bg-neutral-950 p-3 rounded-md border border-neutral-700">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={sessionDetails.data.session.user_id}
                          colors={[
                            "#2c2b4b",
                            "#a75293",
                            "#9c7a9d",
                            "#9ddacb",
                            "#f8dcb4",
                          ]}
                          variant="beam"
                          size={24}
                        />
                        <div className="text-sm font-mono">
                          {sessionDetails.data.session.user_id}
                        </div>
                      </div>
                      {sessionDetails.data.session.language && (
                        <div className="text-sm text-gray-400">
                          <span className="font-medium">Language:</span>{" "}
                          {sessionDetails.data.session.language}
                        </div>
                      )}
                      {sessionDetails.data.session.country && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="font-medium">Location:</span>
                          <div className="flex items-center gap-1">
                            <CountryFlag
                              country={sessionDetails.data.session.country}
                            />
                            <span>
                              {getCountryName(
                                sessionDetails.data.session.country
                              )}
                            </span>
                            {sessionDetails.data.session.iso_3166_2 && (
                              <span>
                                ({sessionDetails.data.session.iso_3166_2})
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Device Information
                    </h4>
                    <div className="space-y-2 bg-neutral-950 p-3 rounded-md border border-neutral-700">
                      <div className="flex items-center gap-2 text-sm">
                        <MonitorSmartphone className="w-4 h-4" />
                        <span className="font-medium">Device Type:</span>{" "}
                        {sessionDetails.data.session.device_type || "Unknown"}
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Browser
                          browser={
                            sessionDetails.data.session.browser || "Unknown"
                          }
                        />
                        <span className="font-medium">Browser:</span>{" "}
                        {sessionDetails.data.session.browser || "Unknown"}
                        {sessionDetails.data.session.browser_version && (
                          <span className="text-gray-400">
                            ({sessionDetails.data.session.browser_version})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <OperatingSystem
                          os={
                            sessionDetails.data.session.operating_system || ""
                          }
                        />
                        <span className="font-medium">OS:</span>{" "}
                        {sessionDetails.data.session.operating_system ||
                          "Unknown"}
                        {sessionDetails.data.session
                          .operating_system_version && (
                          <span className="text-gray-400">
                            (
                            {
                              sessionDetails.data.session
                                .operating_system_version
                            }
                            )
                          </span>
                        )}
                      </div>

                      {sessionDetails.data.session.screen_width &&
                      sessionDetails.data.session.screen_height ? (
                        <div className="text-sm text-gray-400">
                          <span className="font-medium">Screen:</span>{" "}
                          {sessionDetails.data.session.screen_width} x{" "}
                          {sessionDetails.data.session.screen_height}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <h4 className="text-sm font-medium mb-2">
                      Session Information
                    </h4>
                    <div className="space-y-2 bg-neutral-950 p-3 rounded-md border border-neutral-700">
                      <div className="text-sm">
                        <span className="font-medium">Duration:</span>{" "}
                        {durationFormatted}
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Start Time:</span>{" "}
                        {DateTime.fromSQL(
                          sessionDetails.data.session.session_start
                        ).toFormat("MMMM d, yyyy h:mm:ss a")}
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">End Time:</span>{" "}
                        {DateTime.fromSQL(
                          sessionDetails.data.session.session_end
                        ).toFormat("MMMM d, yyyy h:mm:ss a")}
                      </div>

                      {sessionDetails.data.session.referrer && (
                        <div className="text-sm">
                          <span className="font-medium">Referrer:</span>
                          <span className="text-gray-400 ml-1 break-all">
                            {sessionDetails.data.session.referrer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="py-4 text-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SessionCardSkeleton() {
  return (
    <div className="mb-3 rounded-lg bg-neutral-900 border border-neutral-800 p-3">
      <div className="flex items-center">
        {/* Avatar and User ID */}
        <div className="flex items-center gap-2 min-w-[110px]">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Icons */}
        <div className="flex space-x-2 items-center ml-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
        </div>

        {/* Entry/Exit paths */}
        <div className="flex items-center ml-3 flex-1 min-w-0">
          <Skeleton className="h-3 w-20" />
          <div className="mx-2">
            <Skeleton className="h-3 w-3" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Time */}
        <div className="ml-3">
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Expand icon */}
        <div className="ml-3 flex-shrink-0">
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
