import Express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { nanoid } from "nanoid";
import {
  CreateMatchCommand,
  JoinMatchCommand,
  MatchCreated,
} from "@planning-poker/events";

const app = Express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", onConnection);
io.on("disconnect", () => console.log("Client disconnected"));

function onConnection(socket: Socket) {
  console.log("New connection");

  socket.on(JoinMatchCommand, (matchId: string) => {
    socket.join(matchId);
    socket.emit("joined-match", matchId);
    console.log("Joined match", matchId, socket.id);
  });

  socket.on(CreateMatchCommand, () => {
    const matchId = nanoid();
    socket.emit(MatchCreated, matchId);
    console.log("Match created", matchId);
  });
}

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
