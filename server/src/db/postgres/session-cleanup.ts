import { insertSessions } from "../clickhouse/clickhouse";
import { sql } from "./postgres";
import { Session } from "./types";
import { DateTime } from "luxon";

function convertPostgresToClickhouse(postgresTimestamp: string): string {
  return DateTime.fromISO(postgresTimestamp).toFormat("yyyy-MM-dd HH:mm:ss");
}

export async function cleanupOldSessions() {
  const deletedSessions = await sql<Session[]>`
    DELETE FROM active_sessions 
    WHERE last_activity < NOW() - INTERVAL '1 minute'
    RETURNING *
  `;
  console.log(`Cleaned up ${deletedSessions.length} sessions`);
  await insertSessions(
    deletedSessions.map((e) => ({
      ...e,
      start_time: convertPostgresToClickhouse(e.start_time),
      last_activity: convertPostgresToClickhouse(e.last_activity),
    }))
  );
}
