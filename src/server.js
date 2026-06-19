import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import socketServer from "./socket/socketServer.js";

connectDB();

const server = http.createServer(app);

/*
=========================
SOCKET INIT
=========================
*/

const io = socketServer(server);

/*
=========================
GLOBAL IO
=========================
*/

global.io = io;

server.listen(process.env.PORT || 5000, () => {
  console.log("Server Running");
});