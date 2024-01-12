import * as events from "@planning-poker/events";
import { Match } from "@planning-poker/models";
import log from "../../lib/logger";
import * as repo from "../../db/repository";
import { AppSocket } from "../../types";

export default async function joinMatch(
  socket: AppSocket,
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

  try {
    const match = await repo.getMatch(matchId);
    socket.join(matchId);
    callback(match);
  } catch (err) {
    if (!(err instanceof Error)) return

    log.error(err);
    callback(undefined, {
      message: err.message,
    });
  }
}