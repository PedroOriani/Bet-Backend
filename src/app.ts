import express from 'express';
import cors from 'cors';
import { betRouter, gamesRouter, participantsRouter } from './routes';
import { handleErrors } from './middlewares';
import { loadEnv } from './config/env';


const app = express();

loadEnv();

app
  .use(express.json())
  .use(cors())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/participants', participantsRouter)
  .use('/games', gamesRouter)
  .use('/bets', betRouter)
  .use(handleErrors);

export default app;
