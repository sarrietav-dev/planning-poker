import initializeMethods from "./socket";
import { connectClient as connectRedisClient } from "./db/redis";
import log from "./lib/logger";
import dotenv from "dotenv"
import { io, server } from "./socket-io-server";
import socketMiddleware from "./middleware";

dotenv.config()
connectRedisClient();

io.use(socketMiddleware)

io.on("connection", (socket) => {
  log.info(`Client connected: socket id: ${socket.id} userId: ${socket.data.userId}`);
  initializeMethods(socket);

  socket.emit("session", { sessionId: socket.data.sessionId, userId: socket.data.userId, username: socket.data.username });
});

server.listen(3000, () => {
  log.info("Server listening on port 3000");
});
