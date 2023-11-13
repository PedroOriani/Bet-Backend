import participantController from '@/controllers/participant-controller';
import { validateSchema } from '@/middlewares';
import { participantSchema } from '@/schemas';
import { Router } from 'express';

const participantsRouter = Router();

participantsRouter.post('/', validateSchema(participantSchema), participantController.createParticipant);
participantsRouter.get('/', participantController.getParticipants);

export { participantsRouter };
