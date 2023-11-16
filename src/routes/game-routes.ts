import { Router } from 'express';
import gameController from '../controllers/game-controller';
import { validateSchema } from '../middlewares';
import { gameSchema } from '../schemas';

const gamesRouter = Router();

gamesRouter
  .post('/', validateSchema(gameSchema), gameController.createGame)
  .post('/:id/finish', gameController.finishGame)
  .get('/', gameController.getGames)
  .get('/:id', gameController.getGameById);

export { gamesRouter };
