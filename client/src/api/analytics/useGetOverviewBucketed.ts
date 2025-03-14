import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import { APIResponse } from "../types";
import { getStartAndEndDate, authedFetch } from "../utils";
import { useStore } from "../../lib/store";

type PeriodTime = "current" | "previous";

export type GetOverviewBucketedResponse = {
  time: string;
  pageviews: number;
  sessions: number;
  pages_per_session: number;
  bounce_rate: number;
  session_duration: number;
  users: number;
}[];

export function useGetOverviewBucketed({
  periodTime,
  past24Hours,
  site,
}: {
  periodTime?: PeriodTime;
  past24Hours?: boolean;
  site?: number | string;
}): UseQueryResult<APIResponse<GetOverviewBucketedResponse>> {
  const { time, previousTime, bucket, filters } = useStore();

  const timeToUse = periodTime === "previous" ? previousTime : time;

  const { startDate, endDate } = getStartAndEndDate(timeToUse);

  return useQuery({
    queryKey: [
      "overview-bucketed",
      timeToUse,
      bucket,
      site,
      filters,
      past24Hours,
    ],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return authedFetch(
        `${BACKEND_URL}/overview-bucketed?${
          startDate ? `startDate=${startDate}&` : ""
        }${
          endDate ? `endDate=${endDate}&` : ""
        }timezone=${timezone}&bucket=${bucket}&site=${site}&filters=${JSON.stringify(
          filters
        )}${past24Hours ? `&past24Hours=${past24Hours}` : ""}`
      ).then((res) => res.json());
    },
    placeholderData: (_, query: any) => {
      if (!query?.queryKey) return undefined;
      const prevQueryKey = query.queryKey as [string, string, string];
      const [, , prevSite] = prevQueryKey;

      if (prevSite === site) {
        return query.state.data;
      }
      return undefined;
    },
    staleTime: Infinity,
  });
}
