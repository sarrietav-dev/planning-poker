import Express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

const app = Express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", onConnection);

function onConnection(socket: Socket) {
  socket.on("chat message", forwardMessage);
}

function forwardMessage(msg: any) {
  io.emit("chat message", msg);
}

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
