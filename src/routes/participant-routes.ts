import { Router } from 'express';
import participantController from '../controllers/participant-controller';
import { validateSchema } from '../middlewares';
import { participantSchema } from '../schemas';

const participantsRouter = Router();

participantsRouter.post('/', validateSchema(participantSchema), participantController.createParticipant);
participantsRouter.get('/', participantController.getParticipants);

export { participantsRouter };
