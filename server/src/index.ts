import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { trackPageView } from "./actions/trackPageView";
import { initializeClickhouse, insertEvent } from "./db/clickhouse";
import { TrackingPayload } from "./types";
import { getIpAddress } from "./utils";
import { initializePostgres } from "./db/postgres";
import { UAParser } from "ua-parser-js";

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

const uaParser = new UAParser();

// Track event endpoint
server.post<{ Body: TrackingPayload }>(
  "/track/event",
  async (
    request: FastifyRequest<{ Body: TrackingPayload }>,
    reply: FastifyReply
  ) => {
    try {
      const payload = {
        ...request.body,
        ip_address: getIpAddress(request),
        timestamp: new Date().toISOString(),
      };

      const success = await insertEvent(payload);
      if (!success) {
        throw new Error("Failed to insert event");
      }

      return { success: true };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: "Failed to track event",
      });
    }
  }
);

const start = async () => {
  try {
    // Initialize the database
    await Promise.allSettled([initializeClickhouse(), initializePostgres()]);

    // Start the server
    await server.listen({ port: 3001, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
