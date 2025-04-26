import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../../lib/const";
import { useStore } from "../../lib/store";
import { authedFetchWithError } from "../utils";

export type Event = {
  timestamp: string;
  event_name: string;
  properties: string;
  user_id: string;
  hostname: string;
  pathname: string;
  querystring: string;
  page_title: string;
  referrer: string;
  browser: string;
  operating_system: string;
  country: string;
  device_type: string;
  type: string;
};

export function useGetEvents(count = 10) {
  const { site } = useStore();
  return useQuery({
    queryKey: ["events", site, count],
    refetchInterval: 5000,
    queryFn: () =>
      authedFetchWithError<{ data: Event[] }>(
        `${BACKEND_URL}/recent-events/${site}?count=${count}`
      ).then((res) => res.data),
  });
}
