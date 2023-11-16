import Express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import initializeMethods from "./socket";
import { Socket } from "dgram";

const app = Express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", initializeMethods);
io.on("disconnect", () => console.log("Client disconnected"));

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
