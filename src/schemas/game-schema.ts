import Joi from 'joi';
import { InputGameBody } from '../protocols';

export const gameSchema = Joi.object<InputGameBody>({
  homeTeamName: Joi.string().min(3).required(),
  awayTeamName: Joi.string().min(3).required(),
});
