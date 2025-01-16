import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { initializeDatabase } from "./db/clickhouse";

const fastify = Fastify({
  logger: true,
});

// Register CORS
fastify.register(cors, {
  origin: true, // In production, you should specify your frontend domain
});

interface TrackingPayload {
  url: string;
  timestamp: string;
  sessionId: string;
  [key: string]: any;
}

// Health check endpoint
fastify.get("/health", async () => {
  return { status: "ok" };
});

// Track pageview endpoint
fastify.post<{ Body: TrackingPayload }>(
  "/track/pageview",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.body;
    console.info(payload);
    // TODO: Implement pageview tracking logic
    return { success: true };
  }
);

// Track event endpoint
fastify.post<{ Body: TrackingPayload }>(
  "/track/event",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.body;
    // TODO: Implement event tracking logic
    return { success: true };
  }
);

const start = async () => {
  try {
    // Initialize the database
    await initializeDatabase();

    // Start the server
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
