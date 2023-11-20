import { nanoid } from "nanoid";
import { Socket } from "socket.io";
import * as repo from "./db/repository";
import * as events from "@planning-poker/events";
import { Match } from "@planning-poker/models";
import log from "./lib/logger";

type Awk<T> = (response?: T, error?: { message: string }) => void;

export default (socket: Socket) => {
  log.info(`Client connected: ${socket.id}`);

  async function joinMatch(
    { matchId, mode, name }: JoinMatchProps,
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
      socket.to(matchId).emit(events.PlayerJoined, { matchId, name });
      log.info(`Player joined: ${matchId} ${name}`);
    } else {
      await repo.addSpectator(matchId, socket.id, name);
      socket.to(matchId).emit(events.SpectatorJoined, { matchId, name });
      log.info(`Spectator joined: ${matchId} ${name}`);
    }

    socket.join(matchId);
    const match = await repo.getMatch(matchId);
    callback(match);
  }

  async function createMatch(name: string, callback: Awk<{ matchId: string }>) {
    const matchId = nanoid();
    await repo.createMatch(matchId, name, socket.id);
    log.info(`Match created: ${matchId} ${name} by ${socket.id}`);
    callback({ matchId });
  }

  socket.on(events.JoinMatchCommand, joinMatch);
  socket.on(events.CreateMatchCommand, createMatch);
};

type JoinMatchProps = {
  matchId: string;
  mode: "spectator" | "player";
  name: string;
};
