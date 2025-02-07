import { useQuery } from "@tanstack/react-query";
import { useTimeSelection } from "../../lib/timeSelectionStore";
import { getReferrers } from "../../actions/getReferrers";
import { getStartAndEndDate } from "./utils";

export function useGetReferrers() {
  const { time } = useTimeSelection();

  const { startDate, endDate } = getStartAndEndDate(time);

  return useQuery({
    queryKey: ["referrers", time],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return getReferrers({
        startDate,
        endDate,
        timezone,
      });
    },
  });
}
