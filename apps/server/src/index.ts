import initializeMethods from "./socket";
import { connectClient as connectRedisClient } from "./db/redis";
import log from "./lib/logger";
import dotenv from "dotenv"
import { getSession } from "./db/repository";
import { nanoid } from "nanoid";
import { io, server } from "./socket-io-server";

dotenv.config()
connectRedisClient();


io.use(async (socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;

  if (sessionId) {
    const session = await getSession(sessionId);

    if (session) {
      socket.data.sessionId = session.sessionId;
      socket.data.userId = session.userId;

      return next();
    }
  }

  socket.data.sessionId = nanoid();
  socket.data.userId = nanoid();

  return next();
})

io.on("connection", (socket) => {
  log.info(`Client connected: socket id: ${socket.id} userId: ${socket.data.userId}`);
  initializeMethods(socket);

  socket.emit("session", { sessionId: socket.data.sessionId, userId: socket.data.userId, username: socket.data.username });
});

server.listen(3000, () => {
  log.info("Server listening on port 3000");
});
