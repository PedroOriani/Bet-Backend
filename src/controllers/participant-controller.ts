import { NextFunction, Request, Response } from "express";
import participantService from "../services/participant-service";
import httpStatus from "http-status";

async function createParticipant(req: Request, res: Response, next: NextFunction){
    const { name, balance } = req.body

    const participant = await participantService.createParticipant(name, Number(balance))

    res.status(httpStatus.CREATED).send(participant)
}

async function getParticipants(req: Request, res: Response, next: NextFunction){
    
    const participants = await participantService.getParticipants()

    res.status(httpStatus.OK).send(participants)
}

const participantController = {
    createParticipant,
    getParticipants
}

export default participantController