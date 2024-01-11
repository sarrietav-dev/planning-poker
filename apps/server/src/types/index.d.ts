import events from "@planning-poker/events";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type AppSocket = Socket<events.ServerToClientEvents & { connection: () => void }, events.ClientToServerEvents, DefaultEventsMap, events.SocketData>