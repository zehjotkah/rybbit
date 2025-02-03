import { useQuery } from "@tanstack/react-query";
import { useTimeSelection } from "../../lib/timeSelectionStore";
import { getBrowsers } from "../actions/getBrowsers";
import { getStartAndEndDate } from "./utils";

export function useGetBrowsers() {
  const { time } = useTimeSelection();

  const { startDate, endDate } = getStartAndEndDate(time);

  return useQuery({
    queryKey: ["browsers", time],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return getBrowsers({
        startDate,
        endDate,
        timezone,
      });
    },
  });
}
