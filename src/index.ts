import express from "express";
import { WebSocketServer } from "ws";

const port = 5000;

const app = express();

const httpServer = app.listen(port, () => {
  console.log(`Server is listening on ${port} `);
});

const wss = new WebSocketServer({ server: httpServer });

const users: string[] = [];
const rooms: {
  id: string;
  ws: any[];
  users: string[];
}[] = [];

function createRoom(id: string, ws: any, userId: string) {
  users.push(userId);
  rooms.push({
    id,
    users: [userId],
    ws: [ws],
  });
  return { id, userId };
}

function joinRoom(roomId: string, userId: string, ws: any) {
  const room = rooms.filter((e) => e.id === roomId);
  room[0].users.push(userId);
  room[0].ws.push(ws);
  return room;
}

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", async (data) => {
    try {
      if (JSON.parse(data.toString()).message === "establish") {
        console.log("established");
        ws.send(JSON.stringify({ message: "established" }));
        return;
      }

      if (JSON.parse(data.toString()).message === "create") {
        const response = createRoom(
          JSON.parse(data.toString()).id,
          ws,
          JSON.parse(data.toString()).username
        );
        console.log("created response", rooms);
        ws.send(JSON.stringify({ message: "created", id: response.id }));
        return;
      }

      if (JSON.parse(data.toString()).message === "join") {
        const response = joinRoom(
          JSON.parse(data.toString()).roomId,
          JSON.parse(data.toString()).username,
          ws
        );
        console.log("response", response);
      }

      if (JSON.parse(data.toString()).message === "send") {
        const userId = JSON.parse(data.toString()).username;
        const findRoom = rooms.filter((e) => e.users.some((e) => e === userId));

        findRoom[0].ws.forEach((e) => {
          e.send(JSON.parse(data.toString()).userMessage);
        });
      }
    } catch (error) {
      ws.send(`error:${error}`);
    }
  });

  console.log(rooms);
});
