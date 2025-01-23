import { DateTime } from "luxon";

export type Pageview = {
  timestamp: DateTime;
  session_id: string;
  user_id: string;
  hostname: string;
  pathname: string;
  querystring: string;
  page_title: string;
  referrer: string;
  browser: string;
  operating_system: string;
  language: string;
  screen_width: number;
  screen_height: number;
  device_type: string;
};
