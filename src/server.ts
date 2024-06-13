import express, { Request, Response } from "express";

import dotenv from "dotenv";

import bodyParser from "body-parser";

import http from "http";

import rootRouter from "./app/routes";

import connectDB from "./config/database";

import { initializeSocketServer } from "./socket";

const app = express();

const port: number = 8000;

dotenv.config();

connectDB();

// create http server instance
const server = http.createServer(app);

// Initialize Socket  server
initializeSocketServer(server);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api/v1", rootRouter());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Voltrox Nject Backend App!");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
