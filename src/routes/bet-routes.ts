import betController from '../controllers/bet-controller';
import { validateSchema } from '../middlewares';
import { betSchema } from '../schemas';
import { Router } from 'express';


const betRouter = Router();

betRouter.post('/', validateSchema(betSchema), betController.createBet);

export { betRouter };
