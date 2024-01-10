import { nanoid } from "nanoid";
import { Socket } from "socket.io";
import * as repo from "./db/repository";
import * as events from "@planning-poker/events";
import { Match } from "@planning-poker/models";
import log from "./lib/logger";
import { DefaultEventsMap, EventsMap } from "socket.io/dist/typed-events";
import { Awk } from "@planning-poker/events";

export default (socket: Socket<events.ServerToClientEvents & { connection: () => void }, events.ClientToServerEvents, DefaultEventsMap, events.SocketData>) => {
  log.info(`Client connected: ${socket.id}`);

  async function joinMatch(
    matchId: string,
    name: string,
    mode: "spectator" | "player",
    callback: Awk<Match>
  ) {
    if (!(await repo.doesMatchExist(matchId))) {
      log.info(`Match does not exist: ${matchId}`);
      callback(undefined, {
        message: "Match does not exist",
      });
      return;
    }

    if (mode === "player") {
      await repo.addPlayer(matchId, socket.id, name);
      socket
        .to(matchId)
        .emit(events.PlayerJoined, {
          matchId,
          name,
          id: socket.id,
        });
      log.info(`Player joined: ${matchId} ${name}`);
    } else {
      await repo.addSpectator(matchId, socket.id, name);
      socket
        .to(matchId)
        .emit(events.SpectatorJoined, {
          matchId,
          name,
          id: socket.id,
        });
      log.info(`Spectator joined: ${matchId} ${name}`);
    }

    socket.join(matchId);
    const match = await repo.getMatch(matchId);
    callback(match);
  }

  async function createMatch(name: string, callback: Awk<string>) {
    const matchId = nanoid();
    await repo.createMatch(matchId, name, socket.id);
    log.info(`Match created: ${matchId} ${name} by ${socket.id}`);
    callback(matchId);
  }

  async function onDisconnect() {
    log.info(`Client disconnected: ${socket.id}`);
    for (const room of socket.rooms) {
      const mode = await repo.getPlayerMode(room, socket.id);

      if (mode === "player") {
        socket.to(room).emit(events.PlayerLeft, { playerId: socket.id });
        await repo.removePlayer(room, socket.id);
      } else if (mode === "spectator") {
        socket.to(room).emit(events.SpectatorLeft, { spectatorId: socket.id });
        await repo.removeSpectator(room, socket.id);
      }
    }
  }

  async function onDoesMatchExist(matchId: string, callback: Awk<boolean>) {
    const exists = await repo.doesMatchExist(matchId);
    callback(exists === 1);
  }

  async function onChooseCard(card: number) {
    log.info(`Card chosen: ${socket.id} ${card}`);
    const matchId = socket.rooms.values().next().value;
    await repo.chooseCard(matchId, socket.id, card);
    socket
      .to(matchId)
      .emit(events.PlayerSelectedCard, { playerId: socket.id, card });
  }

  async function onResetGame() {
    const matchId = socket.rooms.values().next().value;
    const isAdmin = await repo.isMatchAdmin(matchId, socket.id);

    if (!isAdmin) {
      log.warn(`User is not admin: ${socket.id}`);
      return;
    }

    await repo.resetGame(matchId);
    socket.to(matchId).emit(events.MatchRestarted);
  }

  async function onRevealCards() {
    const matchId = socket.rooms.values().next().value;
    const isAdmin = await repo.isMatchAdmin(matchId, socket.id);

    if (!isAdmin) {
      log.warn(`User is not admin: ${socket.id}`);
      return;
    }

    socket.to(matchId).emit(events.CardsRevealed);
  }

  socket.on(events.JoinMatchCommand, (matchId, name, mode, callback) => joinMatch(matchId, name, mode, callback));
  socket.on(events.CreateMatchCommand, (name, callback) => createMatch(name, callback));
  socket.on(events.DoesMatchExist, onDoesMatchExist);
  socket.on(events.ChooseCardCommand, onChooseCard);
  socket.on(events.ResetGameCommand, onResetGame);
  socket.on(events.RevealCardsCommand, onRevealCards);
  socket.on("disconnecting", onDisconnect);
};

type JoinMatchProps = {
  matchId: string;
  mode: "spectator" | "player";
  name: string;
};
