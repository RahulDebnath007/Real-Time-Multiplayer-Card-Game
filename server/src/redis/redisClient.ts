import "dotenv/config";
import { createClient } from "redis";

const redisUrl =
  process.env.REDIS_URL ||
  "redis://localhost:6379";

const redisClient =
  createClient({
    url: redisUrl
  });

redisClient.on(
  "error",
  (error) => {
    console.error(
      "Redis Client Error:",
      error
    );
  }
);

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();

    console.log(
      "Redis connected successfully"
    );
  }
}

export default redisClient;