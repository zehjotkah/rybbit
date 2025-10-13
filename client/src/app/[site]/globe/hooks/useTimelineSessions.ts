import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
import { GetSessionsResponse } from "../../../../api/analytics/userSessions";
import { APIResponse } from "../../../../api/types";
import { authedFetch, getQueryParams } from "../../../../api/utils";
import { getFilteredFilters, SESSION_PAGE_FILTERS, useStore } from "../../../../lib/store";
import { useTimelineStore } from "../timelineStore";
import { calculateWindowSize, getActiveSessions } from "../timelineUtils";

export function useTimelineSessions() {
  const { time, site } = useStore();
  const { currentTime, windowSize, manualWindowSize, setTimeRange, setWindowSize } = useTimelineStore();

  const filteredFilters = getFilteredFilters(SESSION_PAGE_FILTERS);

  // Fetch all sessions with a large page size (10000) without pagination
  const { data, isLoading, isError } = useQuery<APIResponse<GetSessionsResponse>>({
    queryKey: ["timeline-sessions", time, site, filteredFilters],
    queryFn: () => {
      const requestParams = {
        ...getQueryParams(time),
        filters: filteredFilters,
        page: 1,
        limit: 10000,
      };

      return authedFetch<APIResponse<GetSessionsResponse>>(`/sessions/${site}`, requestParams);
    },
    staleTime: Infinity,
  });

  const allSessions = useMemo(() => {
    if (!data?.data) return [];
    return data.data;
  }, [data]);

  // Calculate time range from fetched sessions and initialize timeline
  useEffect(() => {
    if (allSessions.length === 0) return;

    // Find the earliest and latest session times
    let earliest: DateTime | null = null;
    let latest: DateTime | null = null;

    allSessions.forEach(session => {
      const start = DateTime.fromSQL(session.session_start, { zone: "utc" }).toLocal();
      const end = DateTime.fromSQL(session.session_end, { zone: "utc" }).toLocal();

      if (!earliest || start < earliest) {
        earliest = start;
      }
      if (!latest || end > latest) {
        latest = end;
      }
    });

    if (earliest && latest) {
      // Only auto-calculate window size if user hasn't manually set it
      if (manualWindowSize === null) {
        const calculatedWindowSize = calculateWindowSize(earliest, latest);
        setWindowSize(calculatedWindowSize);
      }
      setTimeRange(earliest, latest);
    }
  }, [allSessions, setTimeRange, setWindowSize, manualWindowSize]);

  // Filter sessions based on current time window
  const activeSessions = useMemo(() => {
    if (!currentTime || !allSessions.length) return [];
    return getActiveSessions(allSessions, currentTime, windowSize);
  }, [allSessions, currentTime, windowSize]);

  return {
    allSessions,
    activeSessions,
    isLoading,
    isError,
  };
}
