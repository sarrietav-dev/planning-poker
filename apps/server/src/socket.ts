import * as repo from "./db/repository";
import * as events from "@planning-poker/events";
import log from "./lib/logger";
import { AppSocket } from "./types";
import { createMatch, joinMatch, onChooseCard, onDoesMatchExist, onRevealCards, onResetGame, onAssignAdmin } from "./event-handlers";

export default (socket: AppSocket) => {
  let disconnectTimeoutFn: NodeJS.Timeout | undefined;

  if (disconnectTimeoutFn) {
    log.info(`Clearing disconnect timeout: ${socket.data.userId}`);
    clearTimeout(disconnectTimeoutFn);
  }

  async function onDisconnect() {
    disconnectTimeoutFn = setTimeout(async () => {
      log.info(`Client disconnected: ${socket.data.userId}`);
      for (const room of socket.rooms) {
        const mode = await repo.getPlayerMode(room, socket.data.userId);

        if (mode === "player") {
          socket.to(room).emit(events.PlayerLeft, { playerId: socket.data.userId });
          await repo.removePlayer(room, socket.data.userId);
        } else if (mode === "spectator") {
          socket.to(room).emit(events.SpectatorLeft, { spectatorId: socket.data.userId });
          await repo.removeSpectator(room, socket.data.userId);
        }
      }
    }, 3000)
  }

  socket.on(events.JoinMatchCommand, async (matchId, name, mode, callback) => joinMatch(socket, matchId, name, mode, callback));
  socket.on(events.CreateMatchCommand, (name, callback) => createMatch(socket, name, callback));
  socket.on(events.DoesMatchExist, onDoesMatchExist);
  socket.on(events.ChooseCardCommand, (matchId, card) => onChooseCard(socket, matchId, card));
  socket.on(events.ResetGameCommand, (matchId) => onResetGame(socket, matchId));
  socket.on(events.RevealCardsCommand, (matchId) => onRevealCards(socket, matchId));
  socket.on(events.AssignAdminCommand, (matchId, playerId) => onAssignAdmin(socket, matchId, playerId))
  socket.on("disconnecting", onDisconnect);
};