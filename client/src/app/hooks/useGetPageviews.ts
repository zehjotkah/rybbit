import { useQuery } from "@tanstack/react-query";
import { useTimeSelection } from "../../lib/timeSelectionStore";
import { getPageViews } from "../../actions/getPageviews";
import { getStartAndEndDate } from "./utils";

export function useGetPageviews() {
  const { time, bucket } = useTimeSelection();

  const { startDate, endDate } = getStartAndEndDate(time);

  return useQuery({
    queryKey: ["pageviews", time, bucket],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return getPageViews({
        startDate,
        endDate,
        timezone,
        bucket,
      });
    },
  });
}
