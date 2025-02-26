import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { BACKEND_URL } from "../lib/const";
import { FilterParameter, useStore } from "../lib/store";
import { authedFetch, getStartAndEndDate } from "./utils";

export type APIResponse<T> = {
  data: T;
  error?: string;
};

export function useGetLiveUsercount() {
  const { site } = useStore();
  return useQuery({
    queryKey: ["live-user-count", site],
    queryFn: () =>
      authedFetch(`${BACKEND_URL}/live-user-count/${site}`).then((res) =>
        res.json()
      ),
  });
}

type PeriodTime = "current" | "previous";

export function useSingleCol(
  parameter: FilterParameter,
  limit?: number,
  periodTime?: PeriodTime
): UseQueryResult<
  APIResponse<{ value: string; count: number; percentage: number }[]>
> {
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
        }timezone=${timezone}&site=${site}&parameter=${parameter}&filters=${JSON.stringify(
          filters
        )}${limit ? `&limit=${limit}` : ""}`
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

export function useGenericQuery<T>(
  endpoint: string
): UseQueryResult<APIResponse<T>> {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => {
      return authedFetch(`${BACKEND_URL}/${endpoint}`).then((res) =>
        res.json()
      );
    },
    staleTime: Infinity,
  });
}

export function useGenericSiteDataQuery<T>(
  endpoint: string,
  periodTime?: PeriodTime
): UseQueryResult<APIResponse<T>> {
  const { time, previousTime, site, filters } = useStore();
  const timeToUse = periodTime === "previous" ? previousTime : time;
  const { startDate, endDate } = getStartAndEndDate(timeToUse);

  return useQuery({
    queryKey: [endpoint, timeToUse, site, filters],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return authedFetch(
        `${BACKEND_URL}/${endpoint}?${
          startDate ? `startDate=${startDate}&` : ""
        }${
          endDate ? `endDate=${endDate}&` : ""
        }timezone=${timezone}&site=${site}&filters=${JSON.stringify(filters)}`
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

export type GetOverviewBucketedResponse = {
  time: string;
  pageviews: number;
  sessions: number;
  pages_per_session: number;
  bounce_rate: number;
  session_duration: number;
  users: number;
}[];

export function useGetOverviewBucketed(
  periodTime?: PeriodTime
): UseQueryResult<APIResponse<GetOverviewBucketedResponse>> {
  const { time, previousTime, bucket, site, filters } = useStore();
  const timeToUse = periodTime === "previous" ? previousTime : time;

  const { startDate, endDate } = getStartAndEndDate(timeToUse);

  return useQuery({
    queryKey: ["overview-bucketed", timeToUse, bucket, site, filters],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return authedFetch(
        `${BACKEND_URL}/overview-bucketed?${
          startDate ? `startDate=${startDate}&` : ""
        }${
          endDate ? `endDate=${endDate}&` : ""
        }timezone=${timezone}&bucket=${bucket}&site=${site}&filters=${JSON.stringify(
          filters
        )}`
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

export type GetOverviewResponse = {
  sessions: number;
  pageviews: number;
  users: number;
  pages_per_session: number;
  bounce_rate: number;
  session_duration: number;
};

export function useGetOverview(periodTime?: PeriodTime) {
  return useGenericSiteDataQuery<GetOverviewResponse>("overview", periodTime);
}

export type GetSitesResponse = {
  site_id: number;
  site_name: string;
  domain: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}[];

export function useGetSites() {
  return useGenericQuery<GetSitesResponse>("get-sites");
}

export function addSite(domain: string, name: string) {
  return authedFetch(`${BACKEND_URL}/add-site`, {
    method: "POST",
    body: JSON.stringify({
      domain,
      name,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function deleteSite(siteId: number) {
  return authedFetch(`${BACKEND_URL}/delete-site/${siteId}`, {
    method: "POST",
  });
}

export function useSiteHasData(siteId: string) {
  return useGenericQuery<boolean>(`site-has-data/${siteId}`);
}
