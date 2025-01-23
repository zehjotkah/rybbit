export interface TrackingPayload {
  hostname: string;
  pathname: string;
  querystring: string;
  timestamp: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
  page_title: string;
  referrer: string;
}
