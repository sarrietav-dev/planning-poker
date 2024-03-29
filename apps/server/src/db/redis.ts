import { createClient } from "redis";
import log from "../lib/logger";

const client = createClient({ url: process.env.REDIS_URL });

client.on("connect", () => {
  log.info("Redis client connected");
});

client.on("error", (err) => {
  log.error(`Something went wrong ${err}`);
});

export function connectClient() {
  client.connect();
}

export default client;
