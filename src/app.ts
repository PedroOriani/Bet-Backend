import express, { Request, Response } from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import { gamesRouter, participantsRouter } from "./routes";
import { loadEnv } from "./config/env";
import { handleErrors } from "./middlewares";

const app = express();

loadEnv()

app
    .use(express.json())
    .use(cors())
    .get('/health', (_req, res) => res.send('OK!'))
    .use('/participants', participantsRouter)
    .use('/games', gamesRouter)
    .use(handleErrors);

export default app