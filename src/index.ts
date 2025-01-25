import express from "express";
import { WebSocketServer } from "ws";
import { Socket } from "./handlers/room-handler";

const port = 5000;

const app = express();

const httpServer = app.listen(port, () => {
  console.log(`Server is listening on ${port} `);
});

const wsServer = new Socket(httpServer);

wsServer.start();
