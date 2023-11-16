import { createClient } from "redis";

const client = createClient();

client.on("connect", () => {
  console.log("Redis client connected");
});

client.on("error", (err) => {
  console.log("Error " + err);
});

export function connectClient() {
  client.connect();
}

export default client;
