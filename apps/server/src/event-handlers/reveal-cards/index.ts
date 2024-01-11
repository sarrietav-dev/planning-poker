import { AppSocket } from "../../types";
import * as repo from "../../db/repository";
import * as events from "@planning-poker/events";
import log from "../../lib/logger";

export default async function onRevealCards(socket: AppSocket, matchId: string) {
  const isAdmin = await repo.isMatchAdmin(matchId, socket.data.userId);

  if (!isAdmin) {
    log.warn(`User is not admin: ${socket.data.userId}`);
    return;
  }

  log.info(`Cards revealed: ${matchId}`);

  socket.to(matchId).emit(events.CardsRevealed);
}