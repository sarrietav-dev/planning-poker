import Express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = Express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
