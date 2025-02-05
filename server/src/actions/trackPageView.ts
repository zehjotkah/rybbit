import { FastifyRequest } from "fastify";
import { TrackingPayload } from "../types";
import { getUserId, getDeviceType, getIpAddress } from "../utils";
import crypto from "crypto";
import clickhouse from "../db/clickhouse/clickhouse";
import { DateTime } from "luxon";
import { sql } from "../db/postgres/postgres";
import UAParser, { UAParser as userAgentParser } from "ua-parser-js";

import { Pageview } from "../db/clickhouse/types";
import { pageviewQueue } from "./pageviewQueue";

type TotalPayload = TrackingPayload & {
  userId: string;
  timestamp: string;
  sessionId: string;
  ua: UAParser.IResult;
  referrer: string;
  ipAddress: string;
};

// const insertPageview = async (pageview: TotalPayload) => {
//   try {
//     const formattedTimestamp = DateTime.fromISO(pageview.timestamp).toFormat(
//       "yyyy-MM-dd HH:mm:ss"
//     );
//     await clickhouse.insert({
//       table: "pageviews",
//       values: [
//         {
//           timestamp: formattedTimestamp,
//           session_id: pageview.sessionId,
//           user_id: pageview.userId,
//           hostname: pageview.hostname || "",
//           pathname: pageview.pathname || "",
//           querystring: pageview.querystring || "",
//           page_title: pageview.page_title || "",
//           referrer: pageview.referrer || "",
//           browser: pageview.ua.browser.name,
//           operating_system: pageview.ua.os.name,
//           language: pageview.language || "",
//           screen_width: pageview.screenWidth || 0,
//           screen_height: pageview.screenHeight || 0,
//           device_type: getDeviceType(
//             pageview.screenWidth,
//             pageview.screenHeight
//           ),
//         },
//       ],
//       format: "JSONEachRow",
//     });
//     return true;
//   } catch (error) {
//     console.error("Error inserting pageview:", error);
//     return false;
//   }
// };

const getExistingSession = async (userId: string): Promise<Pageview | null> => {
  const [existingSession] = await sql<Pageview[]>`
    SELECT * FROM active_sessions WHERE user_id = ${userId}
  `;
  return existingSession;
};

const updateSession = async (
  pageview: TotalPayload,
  existingSession: Pageview | null
) => {
  if (existingSession) {
    await sql`
      UPDATE active_sessions SET last_activity = ${pageview.timestamp}, pageviews = pageviews + 1 WHERE user_id = ${pageview.userId}
    `;
    return;
  }

  const inserts = {
    session_id: pageview.sessionId,
    user_id: pageview.userId,
    hostname: pageview.hostname || "",
    start_time: pageview.timestamp || "",
    last_activity: pageview.timestamp || "",
    pageviews: 1,
    entry_page: pageview.pathname || "",
    // exit_page: pageview.pathname,
    device_type: getDeviceType(
      pageview.screenWidth,
      pageview.screenHeight,
      pageview.ua.os.name
    ),
    screen_width: pageview.screenWidth || 0,
    screen_height: pageview.screenHeight || 0,
    browser: pageview.ua.browser.name || "",
    operating_system: pageview.ua.os.name || "",
    language: pageview.language || "",
    referrer: pageview.referrer || "",
  };

  await sql`
    INSERT INTO active_sessions ${sql(inserts)}
  `;
};

export async function trackPageView(
  request: FastifyRequest<{ Body: TrackingPayload }>
) {
  const userAgent = request.headers["user-agent"] || "";
  const ipAddress = getIpAddress(request);
  const userId = getUserId(ipAddress, userAgent);
  const existingSession = await getExistingSession(userId);

  const payload = {
    ...request.body,
    ipAddress: ipAddress,
    timestamp: new Date().toISOString(),
    ua: userAgentParser(userAgent),
    userId: userId,
    sessionId: existingSession?.session_id || crypto.randomUUID(),
  };
  console.info(payload.ua.device);
  console.info(payload.ua.os);

  pageviewQueue.add(payload);
  // insertPageview(payload);
  updateSession(payload, existingSession);
}
