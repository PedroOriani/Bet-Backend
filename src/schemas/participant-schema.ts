import Joi from 'joi';
import { InputParticipantBody } from '../protocols';

export const participantSchema = Joi.object<InputParticipantBody>({
  name: Joi.string().min(3).required(),
  balance: Joi.number().integer().min(1000).required(),
});
