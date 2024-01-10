import { AppSocket } from "../../types";
import log from "../../lib/logger";
import * as repo from "../../db/repository";
import * as events from "@planning-poker/events";

export default async function onChooseCard(socket: AppSocket, card: number) {
  log.info(`Card chosen: ${socket.data.userId} ${card}`);
  const matchId = socket.rooms.values().next().value;
  await repo.chooseCard(matchId, socket.data.userId, card);
  socket
    .to(matchId)
    .emit(events.PlayerSelectedCard, { playerId: socket.data.userId, card });
}