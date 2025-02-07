import { useQuery } from "@tanstack/react-query";
import { useTimeSelection } from "../lib/timeSelectionStore";
import { getCountries } from "../actions/getCountries";
import { getStartAndEndDate } from "./utils";

export function useGetCountries() {
  const { time } = useTimeSelection();

  const { startDate, endDate } = getStartAndEndDate(time);

  return useQuery({
    queryKey: ["countries", time],
    queryFn: () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return getCountries({
        startDate,
        endDate,
        timezone,
      });
    },
  });
}
