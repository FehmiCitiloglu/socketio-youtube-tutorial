import { fdatasync } from "fs";

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const fs = require("fs-extra");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  //to allow cross origin requests
  cors: {
    origin: "http://localhost:3000", // allowed host

    method: ["GET", "POST"], // allowed request types
  },
});
app.use(cors());

app.get("/", (res: any, req: any) => {
  if (req) {
    console.log(req);
  }
  res.sendFile(__dirname + "/index.html");
});
// app.use(express.static(__dirname, "/"));

server.listen(3001, () => {
  console.log("server running");
});

io.on("connection", (socket: any) => {
  console.log("connected id: " + socket.id);

  socket.on("join_room", (data: any) => {
    socket.join(data);
    console.log(`user with ID: ${socket.id} join room: ${data}`);
  });

  // sending image
  // https://stackoverflow.com/questions/26331787/socket-io-node-js-simple-example-to-send-image-files-from-server-to-client
  socket.on("send_message", (data: any) => {
    socket.to(data.room).emit("receive_message", data);
  });

  io.on("connection", (socket: any) => {
    fs.readFile("image.png", (err: any, data: any) => {
      socket.emit("imageConversionByClient", { image: true, buffer: data });
      socket.emit(
        "imageConversionByServer",
        "data:image/png;base64," + data.toString("base64")
      );
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
