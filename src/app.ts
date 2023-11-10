import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import { handleErrors } from "./middlewares/error-handler-middleware";

const app = express();

dotenv.config()

app
    .use(express.json())
    .use(cors())
    .use(handleErrors);

export default app