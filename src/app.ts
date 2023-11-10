import express, { Express } from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import { handleErrors } from "./middlewares/error-handler-middleware";

const app = express();

dotenv.config()

app
    .use(express.json())
    .use(cors())
    .use('/participants', )
    .use('/games', )
    .use('/bets', )
    .use(handleErrors);

export default app