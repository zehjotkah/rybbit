import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { trackPageView } from "./actions/trackPageView";
import { initializeClickhouse } from "./db/clickhouse/clickhouse";
import { TrackingPayload } from "./types";
import { initializePostgres } from "./db/postgres/postgres";
import cron from "node-cron";
import { cleanupOldSessions } from "./db/postgres/session-cleanup";

const server = Fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
  maxParamLength: 1500,
  trustProxy: true,
});

// Register CORS
server.register(cors, {
  origin: true, // In production, you should specify your frontend domain
});

// Serve static files
server.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/", // optional: default '/'
});

// Health check endpoint
server.get("/health", async () => {
  return { status: "ok" };
});

// Track pageview endpoint
server.post<{ Body: TrackingPayload }>(
  "/track/pageview",
  async (
    request: FastifyRequest<{ Body: TrackingPayload }>,
    reply: FastifyReply
  ) => {
    try {
      await trackPageView(request);
      return { success: true };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: "Failed to track pageview",
      });
    }
  }
);

const start = async () => {
  try {
    console.info("Starting server...");
    // Initialize the database
    await Promise.allSettled([initializeClickhouse(), initializePostgres()]);
    // Start the server
    await server.listen({ port: 3001, host: "0.0.0.0" });
    cron.schedule("*/60 * * * * *", () => {
      console.log("Cleaning up old sessions");
      cleanupOldSessions();
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
