import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
  console.log("Error " + err);
});

export default client;
