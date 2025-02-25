import { ResultSet } from "@clickhouse/client";
import { Filter } from "./types.js";

export function getTimeStatement(
  startDate: string,
  endDate: string,
  timezone: string
) {
  if (!startDate && !endDate) {
    return "";
  }
  return `AND timestamp >= toTimeZone(
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

export function getFilterStatement(filters: string) {
  const filtersArray = JSON.parse(filters);
  if (filtersArray.length === 0) {
    return "";
  }
  return (
    "AND " +
    filtersArray
      .map((filter: Filter) => {
        if (filter.type === "equals") {
          return `${filter.parameter} = '${filter.value}'`;
        }
        if (filter.type === "not_equals") {
          return `${filter.parameter} != '${filter.value}'`;
        }
        if (filter.type === "contains") {
          return `${filter.parameter} LIKE '${filter.value}'`;
        }
        if (filter.type === "not_contains") {
          return `${filter.parameter} NOT LIKE '${filter.value}'`;
        }
      })
      .join(" AND ")
  );
}
