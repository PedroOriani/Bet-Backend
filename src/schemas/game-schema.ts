import Joi from "joi";
import { inputGameBody } from "../protocols";

export const gameSchema = Joi.object<inputGameBody>({
    homeTeamName: Joi.string().min(3).required(),
    awayTeamName: Joi.string().min(3).required()
})