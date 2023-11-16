import { nanoid } from "nanoid";
import { Socket } from "socket.io";
import * as repo from "./db/repository";
import * as events from "@planning-poker/events";

export default (socket: Socket) => {
  async function joinMatch(matchId: string) {
    if (!(await repo.doesMatchExist(matchId))) {
      socket.emit(events.MatchNotFound);
      return;
    }

    socket.join(matchId);
    socket.emit(events.UserJoined, matchId);
  }

  async function createMatch(name: string) {
    const matchId = nanoid();
    await repo.createMatch(matchId, name, socket.id);
    socket.emit(events.MatchCreated, matchId);
  }

  socket.on(events.JoinMatchCommand, joinMatch);
  socket.on(events.CreateMatchCommand, createMatch);
};
