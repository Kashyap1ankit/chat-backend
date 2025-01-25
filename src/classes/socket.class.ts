import { WebSocketServer, WebSocket } from "ws";

export class Socket {
  private wss: WebSocketServer;
  private rooms: {
    id: string;
    ws: WebSocket[];
  }[];

  constructor(httpServer: any) {
    this.wss = new WebSocketServer({ server: httpServer });
    this.rooms = [];
  }

  async start() {
    this.wss.on("connection", (ws) => {
      ws.on("message", async (data) => {
        const parsedData = JSON.parse(data.toString());
        try {
          if (parsedData.type === "establish") {
            ws.send(JSON.stringify({ message: "established" }));
            return;
          }

          if (parsedData.type === "create") {
            const response = this.createRoom(parsedData.id, ws);
            ws.send(JSON.stringify({ message: "created", id: response.id }));
            return;
          }

          if (parsedData.type === "join") {
            const response = this.joinRoom(parsedData.roomId, ws);
            console.log("response", response);
          }

          if (parsedData.type === "send") {
            const roomId = parsedData.roomId;
            const findRoom = this.rooms.filter((e) => e.id === roomId);

            findRoom[0].ws.forEach((e) => {
              e.send(parsedData.userMessage);
            });
          }
        } catch (error) {
          ws.send(`error:${error}`);
        }
      });
    });
  }

  private createRoom(id: string, ws: any) {
    this.rooms.push({
      id,
      ws: [ws],
    });
    return { id };
  }

  private joinRoom(roomId: string, ws: WebSocket) {
    const room = this.rooms.filter((e) => e.id === roomId);
    console.log("mila room", room);
    room[0].ws.push(ws);
    return room;
  }
}
