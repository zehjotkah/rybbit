import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import { useStore, Filter } from "../../lib/store";
import { getStartAndEndDate, authedFetch } from "../utils";
import { APIResponse } from "../types";

export type UsersResponse = {
  user_id: string;
  country: string;
  browser: string;
  operating_system: string;
  device_type: string;
  pageviews: number;
  events: number;
  sessions: number;
  last_seen: string;
  first_seen: string;
};

export interface GetUsersOptions {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  filters?: Filter[];
}

export function useGetUsers(options: GetUsersOptions) {
  const { time, site, filters: storeFilters } = useStore();
  const { startDate, endDate } = getStartAndEndDate(time);

  const { page, pageSize, sortBy, sortOrder } = options;

  return useQuery<
    APIResponse<UsersResponse[]> & {
      totalCount: number;
      page: number;
      pageSize: number;
    }
  >({
    queryKey: [
      "users",
      site,
      time,
      page,
      pageSize,
      sortBy,
      sortOrder,
      storeFilters,
    ],
    queryFn: async () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      return authedFetch(`${BACKEND_URL}/users`, {
        startDate,
        endDate,
        timezone,
        site,
        filters: storeFilters,
        page,
        pageSize,
        sortBy,
        sortOrder,
      }).then((res) => res.json());
    },
  });
}
