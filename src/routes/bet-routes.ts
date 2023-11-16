import { Router } from 'express';
import betController from '../controllers/bet-controller';
import { validateSchema } from '../middlewares';
import { betSchema } from '../schemas';

const betRouter = Router();

betRouter.post('/', validateSchema(betSchema), betController.createBet);

export { betRouter };
