import { nanoid } from "nanoid";
import { Socket } from "socket.io";
import * as repo from "./db/repository";
import * as events from "@planning-poker/events";

type Awk<T> = (response?: T, error?: { message: string }) => void;

export default (socket: Socket) => {
  async function joinMatch(
    { matchId, mode, name }: JoinMatchProps,
    callback: Awk<string>
  ) {
    if (!(await repo.doesMatchExist(matchId))) {
      callback(undefined, {
        message: "Match does not exist",
      });
      return;
    }

    if (mode === "player") {
      await repo.addPlayer(matchId, socket.id, name);
      socket.to(matchId).emit(events.PlayerJoined, { matchId, name });
      socket.join(matchId);
    } else {
      await repo.addSpectator(matchId, socket.id, name);
      socket.to(matchId).emit(events.SpectatorJoined, { matchId, name });
      socket.join(matchId);
    }
  }

  async function createMatch(name: string, callback: Awk<{ matchId: string }>) {
    const matchId = nanoid();
    await repo.createMatch(matchId, name, socket.id);
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
