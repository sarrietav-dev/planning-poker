import { nanoid } from "nanoid";
import { Socket } from "socket.io";
import * as repo from "./db/repository";
import * as events from "@planning-poker/events";

export default (socket: Socket) => {
  async function joinMatch({ matchId, mode, name }: JoinMatchProps) {
    if (!(await repo.doesMatchExist(matchId))) {
      socket.emit(events.MatchNotFound);
      return;
    }

    if (mode === "player") {
      await repo.addPlayer(matchId, socket.id, name);
      socket.emit(events.PlayerJoined, { matchId, name });
    } else {
      await repo.addSpectator(matchId, socket.id, name);
      socket.emit(events.SpectatorJoined, { matchId, name });
    }

    socket.join(matchId);
  }

  async function createMatch(name: string) {
    const matchId = nanoid();
    await repo.createMatch(matchId, name, socket.id);
    socket.emit(events.MatchCreated, matchId); // TODO: Use awknowledgement
  }

  socket.on(events.JoinMatchCommand, joinMatch);
  socket.on(events.CreateMatchCommand, createMatch);
};

type JoinMatchProps = {
  matchId: string;
  mode: "spectator" | "player";
  name: string;
};
