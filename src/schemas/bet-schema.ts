import Joi from 'joi';
import { InputBetBody } from '../protocols';

export const betSchema = Joi.object<InputBetBody>({
  homeTeamScore: Joi.number().integer().required(),
  awayTeamScore: Joi.number().integer().required(),
  amountBet: Joi.number().positive().min(100).required(),
  gameId: Joi.number().integer().positive().required(),
  participantId: Joi.number().integer().positive().required(),
});
