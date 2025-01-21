import { FastifyRequest } from "fastify";
import { TrackingPayload } from "../types";
import { generateUserId, getDeviceType, getIpAddress } from "../utils";
import crypto from "crypto";
import clickhouse from "../db/clickhouse";
import { DateTime } from "luxon";
import { sql } from "../db/postgres";
import UAParser, { UAParser as userAgentParser } from "ua-parser-js";

const insertPageview = async (
  pageview: TrackingPayload & {
    userId: string;
    timestamp: string;
    sessionId: string;
    ua: UAParser.IResult;
  }
) => {
  try {
    const formattedTimestamp = DateTime.fromISO(pageview.timestamp).toFormat(
      "yyyy-MM-dd HH:mm:ss"
    );
    await clickhouse.insert({
      table: "pageviews",
      values: [
        {
          timestamp: formattedTimestamp,
          session_id: pageview.sessionId,
          user_id: pageview.userId,
          hostname: pageview.hostname || "",
          pathname: pageview.pathname || "",
          querystring: pageview.querystring || "",
          referrer: pageview.referrer || "",
          user_agent: pageview.userAgent || "",
          browser: pageview.ua.browser.name,
          operating_system: pageview.ua.os.name,
          language: pageview.language || "",
          screen_width: pageview.screenWidth || 0,
          screen_height: pageview.screenHeight || 0,
          device_type: getDeviceType(
            pageview.screenWidth,
            pageview.screenHeight
          ),
        },
      ],
      format: "JSONEachRow",
    });
    return true;
  } catch (error) {
    console.error("Error inserting pageview:", error);
    return false;
  }
};

const updateSession = async (
  pageview: TrackingPayload & {
    userId: string;
    timestamp: string;
    sessionId: string;
    ua: UAParser.IResult;
  }
) => {
  const [existingSession] = await sql`
    SELECT * FROM active_sessions WHERE user_id = ${pageview.userId}
  `;
  if (existingSession) {
    await sql`
      UPDATE active_sessions SET last_activity = ${pageview.timestamp}, pageviews = pageviews + 1 WHERE user_id = ${pageview.userId}
    `;
    return;
  }

  const inserts = {
    session_id: pageview.sessionId,
    user_id: pageview.userId,
    hostname: pageview.hostname,
    start_time: pageview.timestamp,
    last_activity: pageview.timestamp,
    pageviews: 1,
    entry_page: pageview.pathname,
    // exit_page: pageview.pathname,
    device_type: getDeviceType(pageview.screenWidth, pageview.screenHeight),
    screen_width: pageview.screenWidth,
    screen_height: pageview.screenHeight,
    browser: pageview.ua.browser.name,
    operating_system: pageview.ua.os.name,
    language: pageview.language || "",
    referrer: pageview.referrer || "",
  };

  await sql`
    INSERT INTO active_sessions ${sql(inserts)}
  `;
};

export function trackPageView(
  request: FastifyRequest<{ Body: TrackingPayload }>
) {
  const payload = {
    ...request.body,
    ip_address: getIpAddress(request),
    timestamp: new Date().toISOString(),
    ua: userAgentParser(request.body.userAgent),
  };

  const userId = generateUserId(payload.ip_address, payload.userAgent);
  const timestamp = new Date().toISOString();
  const sessionId = crypto.randomUUID();

  const insertPayload = {
    ...payload,
    userId,
    timestamp,
    sessionId,
  };

  insertPageview(insertPayload);
  updateSession(insertPayload);
}
