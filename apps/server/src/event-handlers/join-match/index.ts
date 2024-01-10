import events from "@planning-poker/events";
import { Match } from "@planning-poker/models";
import log from "../../lib/logger";
import * as repo from "../../db/repository";
import { AppSocket } from "../../types";

export default (socket: AppSocket) => {
  return async function joinMatch(
    matchId: string,
    name: string,
    mode: "spectator" | "player",
    callback: events.Awk<Match>
  ) {
    if (!(await repo.doesMatchExist(matchId))) {
      log.info(`Match does not exist: ${matchId}`);
      callback(undefined, {
        message: "Match does not exist",
      });
      return;
    }

    if (await repo.isUserInMatch(matchId, socket.data.userId)) {
      return;
    }

    if (mode === "player") {
      await repo.addPlayer(matchId, socket.data.userId, name);
      socket
        .to(matchId)
        .emit(events.PlayerJoined, {
          matchId,
          name,
          id: socket.data.userId,
        });
      log.info(`Player joined: ${matchId} ${name}`);
    } else {
      await repo.addSpectator(matchId, socket.data.userId, name);
      socket
        .to(matchId)
        .emit(events.SpectatorJoined, {
          matchId,
          name,
          id: socket.data.userId,
        });
      log.info(`Spectator joined: ${matchId} ${name}`);
    }

    socket.join(matchId);
    const match = await repo.getMatch(matchId);
    callback(match);
  }
}
