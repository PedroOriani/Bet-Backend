import { inputParticipantBody } from '../protocols';
import Joi from 'joi';

export const participantSchema = Joi.object<inputParticipantBody>({
  name: Joi.string().min(5).required(),
  balance: Joi.number().integer().min(1000).required(),
});
