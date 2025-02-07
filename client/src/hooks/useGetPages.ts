import { useQuery } from "@tanstack/react-query";
import { useTimeSelection } from "../lib/timeSelectionStore";
import { getStartAndEndDate } from "./utils";
import { getPages } from "../actions/getPages";

export function useGetPages() {
  const { time } = useTimeSelection();

  const { startDate, endDate } = getStartAndEndDate(time);

  return useQuery({
    queryKey: ["pages", time],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return getPages({
        startDate,
        endDate,
        timezone,
      });
    },
  });
}
