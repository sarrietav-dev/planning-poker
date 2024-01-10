import { Awk } from "@planning-poker/events";
import { nanoid } from "nanoid";
import log from "../../lib/logger";
import { AppSocket } from "../../types";
import * as repo from "../../db/repository";

export async function createMatch(socket: AppSocket, name: string, callback: Awk<string>) {
  const matchId = nanoid();
  await repo.createMatch(matchId, name, socket.data.userId);
  log.info(`Match created: ${matchId} ${name} by ${socket.data.userId}`);
  callback(matchId);
}