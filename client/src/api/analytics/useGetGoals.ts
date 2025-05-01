import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import {
  getFilteredFilters,
  GOALS_PAGE_FILTERS,
  useStore,
} from "../../lib/store";
import { authedFetch } from "../utils";

export interface Goal {
  goalId: number;
  name: string | null;
  goalType: "path" | "event";
  config: {
    pathPattern?: string;
    eventName?: string;
    eventPropertyKey?: string;
    eventPropertyValue?: string | number | boolean;
  };
  createdAt: string;
  total_conversions: number;
  total_sessions: number;
  conversion_rate: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface GoalsResponse {
  data: Goal[];
  meta: PaginationMeta;
}

export function useGetGoals({
  startDate,
  endDate,
  page = 1,
  pageSize = 10,
  sort = "createdAt",
  order = "desc",
  enabled = true,
}: {
  startDate: string;
  endDate: string;
  page?: number;
  pageSize?: number;
  sort?: "goalId" | "name" | "goalType" | "createdAt";
  order?: "asc" | "desc";
  enabled?: boolean;
}) {
  const { site } = useStore();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const filteredFilters = getFilteredFilters(GOALS_PAGE_FILTERS);

  return useQuery({
    queryKey: [
      "goals",
      site,
      startDate,
      endDate,
      timezone,
      filteredFilters,
      page,
      pageSize,
      sort,
      order,
    ],
    queryFn: async () => {
      return authedFetch(`${BACKEND_URL}/goals/${site}`, {
        startDate,
        endDate,
        timezone,
        filteredFilters,
        page,
        pageSize,
        sort,
        order,
      }).then((res) => res.json());
    },
    enabled: !!site && enabled,
  });
}
