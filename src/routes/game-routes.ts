import gameController from '../controllers/game-controller';
import { validateSchema } from '../middlewares';
import { gameSchema } from '../schemas';
import { Router } from 'express';

const gamesRouter = Router();

gamesRouter
  .post('/', validateSchema(gameSchema), gameController.createGame)
  .post('/:id/finish', gameController.finishGame)
  .get('/', gameController.getGames)
  .get('/:id', gameController.getGameById);

export { gamesRouter };
