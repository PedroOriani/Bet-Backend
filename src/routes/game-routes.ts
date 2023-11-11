import { Router } from "express";
import { validateSchema } from "../middlewares/schema-middleware";
import { gameSchema } from "../schemas/game-schema";
import gameController from "../controllers/game-controller";

const gamesRouter = Router()

gamesRouter
    .post('/', validateSchema(gameSchema), gameController.createGame)
    .post('/:id/finish', gameController.finishGame)
    .get('/', gameController.getGames)
    .get('/:id', gameController.getGameById)

export { gamesRouter }