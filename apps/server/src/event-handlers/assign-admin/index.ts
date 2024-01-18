import * as events from "@planning-poker/events";
import { AppSocket } from "../../types";
import log from "../../lib/logger";

export default async function onAssignAdmin(socket: AppSocket, matchId: string, playerId: string) {
  log.info(`Assigning admin: ${playerId} to match: ${matchId}`);
  socket.to(matchId).emit(events.AdminAssigned, { adminId: playerId });
}