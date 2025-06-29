import { ExternalLink, Monitor } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetSessionReplayEvents } from "../../../../../api/analytics/sessionReplay/useGetSessionReplayEvents";
import { useReplayStore } from "../replayStore";
import {
  BrowserTooltipIcon,
  CountryFlagTooltipIcon,
  DeviceTypeTooltipIcon,
  OperatingSystemTooltipIcon,
} from "../../../../../components/TooltipIcons/TooltipIcons";

export function ReplayPlayerTopbar() {
  const params = useParams();
  const siteId = Number(params.site);
  const { sessionId } = useReplayStore();

  const { data } = useGetSessionReplayEvents(siteId, sessionId);

  if (!data?.metadata) {
    return (
      <div className="border border-neutral-800 bg-neutral-900 px-2 py-2 rounded-t-lg overflow-hidden">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="h-4 w-32 bg-neutral-700 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <div className="h-4 w-24 bg-neutral-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const { metadata } = data;
  const pageUrl = metadata.page_url;
  const screenDimensions = `${metadata.screen_width} × ${metadata.screen_height}`;

  // Extract pathname from full URL for display
  const getDisplayPath = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      return url;
    }
  };

  return (
    <div className="border border-neutral-800 bg-neutral-900 px-2 py-2 rounded-t-lg overflow-hidden">
      <div className="flex items-center justify-between min-w-0">
        {/* Left side: Page path with external link */}
        <Link
          className="text-xs text-neutral-300 truncate flex-1 min-w-0 flex items-center hover:underline"
          href={pageUrl}
          target="_blank"
          title={`Open ${pageUrl} in new tab`}
        >
          {getDisplayPath(pageUrl)}
        </Link>

        {/* Right side: Screen dimensions */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 flex-shrink-0 ml-2">
          <CountryFlagTooltipIcon
            country={metadata.country}
            city={metadata.city}
            region={metadata.region}
            className="w-4 h-4"
          />
          <BrowserTooltipIcon
            browser={metadata.browser}
            browser_version={metadata.browser_version}
            size={13}
          />
          <OperatingSystemTooltipIcon
            operating_system={metadata.operating_system}
            operating_system_version={metadata.operating_system_version}
            size={13}
          />
          <DeviceTypeTooltipIcon
            device_type={metadata.device_type}
            screen_width={metadata.screen_width}
            screen_height={metadata.screen_height}
            size={16}
          />

          <span className="whitespace-nowrap">{screenDimensions}</span>
        </div>
      </div>
    </div>
  );
}
