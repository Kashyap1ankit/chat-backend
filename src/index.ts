import express from "express";
import { Socket } from "./classes/socket.class";
import config from "./config/config";

const port = config.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(port, () => {
  console.log(`Server is listening on ${port} `);
});

const wsServer = new Socket(httpServer);

wsServer.start();
