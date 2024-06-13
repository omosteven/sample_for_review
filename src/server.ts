import express, { Request, Response } from "express";

import dotenv from "dotenv";

import bodyParser from "body-parser";

import appRoutes from "./app/routes";

import connectDB from "./config/database";

const app = express();

const port: number = 8000;

dotenv.config();

connectDB();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api/v1", appRoutes());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Voltrox Nject Backend App!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
