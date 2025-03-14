import { Time } from "@/lib/store";
import { DateTime } from "luxon";
import { APIResponse } from "./types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { BACKEND_URL } from "../lib/const";

export function getStartAndEndDate(time: Time) {
  if (time.mode === "range") {
    return { startDate: time.startDate, endDate: time.endDate };
  }
  if (time.mode === "week") {
    return {
      startDate: time.week,
      endDate: DateTime.fromISO(time.week).endOf("week").toISODate(),
    };
  }
  if (time.mode === "month") {
    return {
      startDate: time.month,
      endDate: DateTime.fromISO(time.month).endOf("month").toISODate(),
    };
  }
  if (time.mode === "year") {
    return {
      startDate: time.year,
      endDate: DateTime.fromISO(time.year).endOf("year").toISODate(),
    };
  }
  if (time.mode === "all-time") {
    return { startDate: null, endDate: null };
  }
  return { startDate: time.day, endDate: time.day };
}

export async function authedFetch(url: string, opts: RequestInit = {}) {
  return fetch(url, {
    credentials: "include",
    ...opts,
  });
}

export function useGenericQuery<T>(endpoint: string): UseQueryResult<T> {
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

export async function genericQuery<T>(endpoint: string): Promise<T> {
  return authedFetch(`${BACKEND_URL}/${endpoint}`).then((res) => res.json());
}
