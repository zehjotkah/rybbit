import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { useTimeSelection } from "../lib/timeSelectionStore";
import { getStartAndEndDate } from "./utils";

export type APIResponse<T> = {
  data: T;
  error?: string;
};

export function useGenericQuery<T>(
  endpoint: string
): UseQueryResult<APIResponse<T>> {
  const { time } = useTimeSelection();
  const { startDate, endDate } = getStartAndEndDate(time);

  return useQuery({
    queryKey: [endpoint, time],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return fetch(
        `${process.env.BACKEND_URL}/${endpoint}?startDate=${startDate}&endDate=${endDate}&timezone=${timezone}`
      ).then((res) => res.json());
    },
  });
}

export type GetCountriesResponse = {
  country: string;
  count: number;
  percentage: number;
}[];

export function useGetCountries() {
  return useGenericQuery<GetCountriesResponse>("countries");
}

export type GetDevicesResponse = {
  device_type: string;
  count: number;
  percentage: number;
}[];

export function useGetDevices() {
  return useGenericQuery<GetDevicesResponse>("devices");
}

export type GetOperatingSystemsResponse = {
  operating_system: string;
  count: number;
  percentage: number;
}[];

export function useGetOperatingSystems() {
  return useGenericQuery<GetOperatingSystemsResponse>("operating-systems");
}

export type GetBrowsersResponse = {
  browser: string;
  count: number;
  percentage: number;
}[];

export function useGetBrowsers() {
  return useGenericQuery<GetBrowsersResponse>("browsers");
}

export type GetPagesResponse = {
  pathname: string;
  count: number;
  percentage: number;
}[];

export function useGetPages() {
  return useGenericQuery<GetPagesResponse>("pages");
}

export type GetReferrersResponse = {
  referrer: string;
  count: number;
  percentage: number;
}[];

export function useGetReferrers() {
  return useGenericQuery<GetReferrersResponse>("referrers");
}

export type GetPageViewsResponse = {
  time: string;
  pageviews: number;
}[];

export function useGetPageviews(): UseQueryResult<
  APIResponse<GetPageViewsResponse>
> {
  const { time, bucket } = useTimeSelection();

  const { startDate, endDate } = getStartAndEndDate(time);

  return useQuery({
    queryKey: ["pageviews", time, bucket],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return fetch(
        `${process.env.BACKEND_URL}/pageviews?startDate=${startDate}&endDate=${endDate}&timezone=${timezone}&bucket=${bucket}`
      ).then((res) => res.json());
    },
    placeholderData: keepPreviousData,
  });
}
