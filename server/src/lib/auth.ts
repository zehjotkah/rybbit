import { betterAuth } from "better-auth";
import pg from "pg";
import { username } from "better-auth/plugins";
import dotenv from "dotenv";
import { sql } from "../db/postgres/postgres.js";

dotenv.config();

type AuthType = ReturnType<typeof betterAuth> | null;

export let auth: AuthType | null = null;

export const initAuth = async () => {
  const domains = await sql`SELECT domain FROM sites`;
  console.info(domains);
  auth = betterAuth({
    basePath: "/auth",
    database: new pg.Pool({
      host: process.env.POSTGRES_HOST || "postgres",
      port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [username()],
    trustedOrigins: [
      "http://localhost:3002",
      "http://localhost:3001",
      "https://tracking.tomato.gg",
      ...domains.map(({ domain }) => `https://${domain}`),
    ],
  });
};
