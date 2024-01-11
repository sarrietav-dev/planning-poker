import { createServer } from "http";
import morganMiddleware from "../lib/morganMiddleware";
import Express from "express";
import { Server } from "socket.io";
import { ServerToClientEvents, ClientToServerEvents, SocketData } from "@planning-poker/events";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const app = Express();
app.use(morganMiddleware);
export const server = createServer(app);
export const io = new Server<ServerToClientEvents, ClientToServerEvents, DefaultEventsMap, SocketData>(server, { cors: { origin: "*" } });