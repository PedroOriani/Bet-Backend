import { Router } from "express";
import participantController from "../controllers/bet-controller";

const participantRouter = Router()

participantRouter.post('/', participantController.createParticipant).get('/', participantController.getParticipants)

export { participantRouter }