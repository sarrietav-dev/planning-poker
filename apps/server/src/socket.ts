import * as repo from "./db/repository";
import * as events from "@planning-poker/events";
import log from "./lib/logger";
import { AppSocket } from "./types";
import { createMatch, joinMatch, onDoesMatchExist } from "./event-handlers";

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


  async function onChooseCard(card: number) {
    log.info(`Card chosen: ${socket.data.userId} ${card}`);
    const matchId = socket.rooms.values().next().value;
    await repo.chooseCard(matchId, socket.data.userId, card);
    socket
      .to(matchId)
      .emit(events.PlayerSelectedCard, { playerId: socket.data.userId, card });
  }

  async function onResetGame() {
    const matchId = socket.rooms.values().next().value;
    const isAdmin = await repo.isMatchAdmin(matchId, socket.data.userId);

    if (!isAdmin) {
      log.warn(`User is not admin: ${socket.data.userId}`);
      return;
    }

    log.info(`Game reset: ${matchId}`);

    await repo.resetGame(matchId);
    socket.to(matchId).emit(events.MatchRestarted);
  }

  async function onRevealCards() {
    const matchId = socket.rooms.values().next().value;
    const isAdmin = await repo.isMatchAdmin(matchId, socket.data.userId);

    if (!isAdmin) {
      log.warn(`User is not admin: ${socket.data.userId}`);
      return;
    }

    log.info(`Cards revealed: ${matchId}`);

    socket.to(matchId).emit(events.CardsRevealed);
  }

  socket.on(events.JoinMatchCommand, async (matchId, name, mode, callback) => joinMatch(socket, matchId, name, mode, callback));
  socket.on(events.CreateMatchCommand, (name, callback) => createMatch(socket, name, callback));
  socket.on(events.DoesMatchExist, onDoesMatchExist);
  socket.on(events.ChooseCardCommand, onChooseCard);
  socket.on(events.ResetGameCommand, onResetGame);
  socket.on(events.RevealCardsCommand, onRevealCards);
  socket.on("disconnecting", onDisconnect);
};