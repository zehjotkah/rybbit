import { useQuery } from "@tanstack/react-query";
import { useTimeSelection } from "../lib/timeSelectionStore";
import { getStartAndEndDate } from "./utils";
import { getOperatingSystems } from "../actions/getOperatingSystems";

export function useGetOperatingSystems() {
  const { time } = useTimeSelection();

  const { startDate, endDate } = getStartAndEndDate(time);

  return useQuery({
    queryKey: ["operating-systems", time],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return getOperatingSystems({
        startDate,
        endDate,
        timezone,
      });
    },
  });
}
