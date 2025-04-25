import "dotenv/config";
import express, { Request, Response } from "express";
import { Socket } from "./classes/socket.class";
import config from "./config/config";
import { authRouter } from "./routes/auth";
import passport from "passport";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./db/db";
import cors from "cors";

const port = config.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: "hello world",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Healthy" });
});

app.use("/auth", authRouter);

const httpServer = app.listen(port, () => {
  console.log(`Server is listening on ${port} `);
});

const wsServer = new Socket(httpServer);
console.log(process.env.NODE_ENV);
wsServer.start();
