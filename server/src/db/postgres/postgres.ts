import postgres from "postgres";
import { Session } from "./types";
import dotenv from "dotenv";

dotenv.config();

export const sql = postgres({
  host: process.env.POSTGRES_HOST || "postgres",
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export async function initializePostgres() {
  try {
    await sql<Session[]>`
      CREATE TABLE IF NOT EXISTS active_sessions (
        session_id TEXT PRIMARY KEY,
        user_id TEXT,
        hostname TEXT,
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        pageviews INT DEFAULT 0,
        entry_page TEXT,
        exit_page TEXT,
        device_type TEXT,
        screen_width INT,
        screen_height INT,
        browser TEXT,
        operating_system TEXT,
        language TEXT,
        referrer TEXT
      );
    `;
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}
