import { ExtendedError } from "socket.io/dist/namespace";
import { AppSocket } from "../types";
import { getSession } from "../db/repository";
import { nanoid } from "nanoid";

export default async function socketMiddleware(socket: AppSocket, next: (err?: ExtendedError | undefined) => void) {
  const sessionId = socket.handshake.auth.sessionId;

  if (sessionId) {
    const session = await getSession(sessionId);

    if ("sessionId" in session && "userId" in session) {
      socket.data.sessionId = session.sessionId;
      socket.data.userId = session.userId;

      return next();
    }
  }

  socket.data.sessionId = nanoid();
  socket.data.userId = nanoid();

  return next();
}