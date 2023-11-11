import { Router } from "express";
import betController from "src/controllers/bet-controller";
import { validateSchema } from "src/middlewares";
import { betSchema } from "src/schemas";

const betRouter = Router()

betRouter.post('/', validateSchema(betSchema), betController.createBet)

export { betRouter }