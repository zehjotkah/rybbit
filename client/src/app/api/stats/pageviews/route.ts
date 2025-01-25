import { NextResponse } from "next/server";
import { clickhouse } from "@/lib/clickhouse";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get("days")) || 1;

    const query = `
      SELECT
        formatDateTime(toTimeZone(toStartOfHour(timestamp), 'America/Los_Angeles'), '%Y-%m-%d %H:%M:%S', 'America/Los_Angeles') AS hour,
        count() AS pageviews
      FROM pageviews
      WHERE timestamp >= toTimeZone(now() - INTERVAL ${days} DAY, 'America/Los_Angeles')
      GROUP BY hour
      ORDER BY hour ASC;
    `;

    const result = await clickhouse.query({
      query,
      format: "JSONEachRow",
    });

    const data = await result.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching pageviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch pageviews" },
      { status: 500 }
    );
  }
}
