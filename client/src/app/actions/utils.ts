export function getTimeStatement(
  startDate: string,
  endDate: string,
  timezone: string
) {
  return `
timestamp >= toTimeZone(
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
)
  `;
}
