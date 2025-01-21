export interface TrackingPayload {
  hostname: string;
  pathname: string;
  querystring: string;
  referrer: string;
  timestamp: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
}
