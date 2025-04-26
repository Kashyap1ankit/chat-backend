import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

export class Socket {
  private wss: WebSocketServer;
  private rooms: {
    ws: WebSocket[];
    roomId: string;
    users: string[];
  }[];

  constructor(httpServer: any) {
    this.wss = new WebSocketServer({ server: httpServer });
    this.rooms = [];
  }

  //initialising the connection part

  async start() {
    this.wss.on("connection", (ws) => {
      ws.on("message", async (data: any) => {
        const parsedData = JSON.parse(data);

        //Creating the room

        if (parsedData.type === "create") {
          this.createRoom(ws, parsedData.data.userId);
        }

        //joinin the room

        if (parsedData.type === "join") {
          this.joinRoom(parsedData.data.roomId, parsedData.data.userId, ws);
          console.log(this.rooms);
        }

        //send message in a particular room

        if (parsedData.type === "send-message") {
          const findRoom = this.rooms.find(
            (e) => e.roomId === parsedData.data.roomId
          );

          if (!findRoom) throw new Error("No such room exits");

          findRoom.ws.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(parsedData.data.message);
            }
          });
        }
      });

      ws.send("connected");
    });
  }

  //creating the room

  async createRoom(ws: WebSocket, userId: string) {
    try {
      const roomId = uuidv4();

      this.rooms.push({
        roomId: roomId,
        ws: [ws],
        users: [userId],
      });
    } catch {
      console.log("hi error in creating room");
    }
  }

  async joinRoom(roomId: string, userId: string, ws: WebSocket) {
    try {
      const findRoom = this.rooms.find((room) => room.roomId === roomId);
      if (!findRoom) throw new Error("No room found");
      findRoom.ws.push(ws);
      findRoom.users.push(userId);
    } catch {
      console.log("error aaya hai join krn eme");
    }
  }
}
