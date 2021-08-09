const path = require("path");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

let app = express();
let server = http.createServer(app);
server = app.listen("3000");
let io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("chat message", (name, colorMsg, msg) => {
    io.emit("chat message", name, colorMsg, msg);
  });
  socket.on("name user", (name) => {
    io.emit("name user", name);
    socket.on("disconnect", () => {
      socket.broadcast.emit("disconnectClient", `${name}: Left the chat`);
      socket.broadcast.emit("notPrintMsg", name);
    });
    socket.broadcast.emit("connectClient", `Joined the chat: ${name}`);
  });
  socket.on("print msg", (name) => {
    socket.broadcast.emit("printMsg", name);
  });
  socket.on("not print msg", (userName) => {
    socket.broadcast.emit("notPrintMsg", userName);
  });
});
