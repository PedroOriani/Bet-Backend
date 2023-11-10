import { Request, Response } from "express";
import participantService from "../services/participant-service";

async function createParticipant(req: Request, res: Response){
    const { name, balance } = req.body

    const participant = participantService.createParticipant(name, balance)

    res.status(201).send(participant)
}

async function getParticipants(req: Request, res: Response){
    
}

const participantController = {
    createParticipant,
    getParticipants
}

export default participantController