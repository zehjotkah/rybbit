import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FilterParameter, useStore } from "../../lib/store";
import { APIResponse } from "../types";
import { BACKEND_URL } from "../../lib/const";
import { getStartAndEndDate, authedFetch } from "../utils";

type PeriodTime = "current" | "previous";

export type SingleColResponse = {
  value: string;
  count: number;
  percentage: number;
};

export function useSingleCol({
  parameter,
  limit = 10000,
  periodTime,
  useFilters = true,
}: {
  parameter: FilterParameter;
  limit?: number;
  periodTime?: PeriodTime;
  useFilters?: boolean;
}): UseQueryResult<APIResponse<SingleColResponse[]>> {
  const { time, previousTime, site, filters } = useStore();
  const timeToUse = periodTime === "previous" ? previousTime : time;
  const { startDate, endDate } = getStartAndEndDate(timeToUse);

  return useQuery({
    queryKey: [parameter, timeToUse, site, filters, limit],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return authedFetch(
        `${BACKEND_URL}/single-col?${
          startDate ? `startDate=${startDate}&` : ""
        }${
          endDate ? `endDate=${endDate}&` : ""
        }timezone=${timezone}&site=${site}&parameter=${parameter}${
          limit ? `&limit=${limit}` : ""
        }${useFilters ? `&filters=${JSON.stringify(filters)}` : ""}`
      ).then((res) => res.json());
    },
    staleTime: Infinity,
    placeholderData: (_, query: any) => {
      if (!query?.queryKey) return undefined;
      const prevQueryKey = query.queryKey as [string, string, string];
      const [, , prevSite] = prevQueryKey;

      if (prevSite === site) {
        return query.state.data;
      }
      return undefined;
    },
  });
}
