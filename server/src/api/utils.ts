import { ResultSet } from "@clickhouse/client";

export function getTimeStatement(
  startDate: string,
  endDate: string,
  timezone: string
) {
  return `timestamp >= toTimeZone(
      toStartOfDay(toDateTime('${startDate}', '${timezone}')),
      'UTC'
    )
    AND timestamp < if(
      toDate('${endDate}') = toDate(now(), '${timezone}'),
      now(),
      toTimeZone(
        toStartOfDay(toDateTime('${endDate}', '${timezone}')) + INTERVAL 1 DAY,
        'UTC'
      )
    )`;
}

export async function processResults<T>(
  results: ResultSet<"JSONEachRow">
): Promise<T[]> {
  const data: T[] = await results.json();
  for (const row of data) {
    for (const key in row) {
      if (!isNaN(Number(row[key]))) {
        row[key] = Number(row[key]) as any;
      }
    }
  }
  return data;
}
