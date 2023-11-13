import { inputBetBody } from '@/protocols';
import Joi from 'joi';

export const betSchema = Joi.object<inputBetBody>({
  homeTeamScore: Joi.number().integer().required(),
  awayTeamScore: Joi.number().integer().required(),
  amountBet: Joi.number().positive().min(100).required(),
  gameId: Joi.number().integer().positive().required(),
  participantId: Joi.number().integer().positive().required(),
});
