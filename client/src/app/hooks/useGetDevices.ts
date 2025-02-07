import { useQuery } from "@tanstack/react-query";
import { useTimeSelection } from "../../lib/timeSelectionStore";
import { getDevices } from "../../actions/getDevices";
import { getStartAndEndDate } from "./utils";

export function useGetDevices() {
  const { time } = useTimeSelection();

  const { startDate, endDate } = getStartAndEndDate(time);

  return useQuery({
    queryKey: ["devices", time],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return getDevices({
        startDate,
        endDate,
        timezone,
      });
    },
  });
}
