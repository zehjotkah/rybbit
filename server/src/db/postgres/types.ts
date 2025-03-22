export type Session = {
  session_id: string;
  user_id: string;
  hostname: string;
  start_time: string;
  end_time: string;
  pageviews: number;
  entry_page: string;
  exit_page: string;
  device_type: string;
  screen_width: number;
  screen_height: number;
  browser: string;
  operating_system: string;
  language: string;
  referrer: string;
};
