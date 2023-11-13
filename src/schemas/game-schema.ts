import { inputGameBody } from '@/protocols';
import Joi from 'joi';

export const gameSchema = Joi.object<inputGameBody>({
  homeTeamName: Joi.string().min(3).required(),
  awayTeamName: Joi.string().min(3).required(),
});
