import Express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { nanoid } from "nanoid";
import { JoinMatchCommand } from "@pragma-poker/events";

const app = Express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.post("/api/match", (_, res) => {
  const matchId = nanoid();
  const adminId = nanoid();

  return res.json({ id: matchId, adminId });
});

io.on("connection", onConnection);
io.on("disconnect", () => console.log("Client disconnected"));

function onConnection(socket: Socket) {
  console.log("New connection");

  socket.on(JoinMatchCommand, (matchId: string) => {
    console.log("Joining match", matchId);

    socket.join(matchId);
    socket.emit("joined-match", matchId);
  });
}

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
