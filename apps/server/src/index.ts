import Express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import initializeMethods from "./socket";
import { connectClient as connectRedisClient } from "./db/redis";
import morganMiddleware from "./lib/morganMiddleware";
import log from "./lib/logger";
import dotenv from "dotenv"

const app = Express();
app.use(morganMiddleware);
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
dotenv.config()
connectRedisClient();

io.on("connection", initializeMethods);

server.listen(3000, () => {
  log.info("Server listening on port 3000");
});
