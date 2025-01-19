import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import path from "path";
import {
  initializeDatabase,
  insertPageview,
  insertEvent,
} from "./db/clickhouse";

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

interface TrackingPayload {
  url: string;
  pathname?: string;
  querystring?: string;
  timestamp: string;
  sessionId: string;
  referrer?: string;
  userAgent?: string;
  screenWidth?: number;
  screenHeight?: number;
  language?: string;
  browser?: string;
  eventName?: string;
  eventData?: Record<string, unknown>;
  [key: string]: unknown;
}

// Helper function to get IP address
const getIpAddress = (request: FastifyRequest): string => {
  // Check for proxied IP addresses
  const forwardedFor = request.headers["x-forwarded-for"];
  if (forwardedFor && typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim();
  }

  // Check for Cloudflare
  const cfConnectingIp = request.headers["cf-connecting-ip"];
  if (cfConnectingIp && typeof cfConnectingIp === "string") {
    return cfConnectingIp;
  }

  // Fallback to direct IP
  return request.ip;
};

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
      console.info(request.body);
      const payload = {
        ...request.body,
        ip_address: getIpAddress(request),
        timestamp: new Date().toISOString(),
      };

      const success = await insertPageview(payload);
      if (!success) {
        throw new Error("Failed to insert pageview");
      }

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
    await initializeDatabase();

    // Start the server
    await server.listen({ port: 3001, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
