import { Router } from "express";
import participantController from "../controllers/participant-controller";
import { validateSchema } from "../middlewares/schema-middleware";
import { participantSchema } from "../schemas/participant-schema";

const participantsRouter = Router()

participantsRouter.post('/', validateSchema(participantSchema), participantController.createParticipant)
participantsRouter.get('/', participantController.getParticipants)

export { participantsRouter }