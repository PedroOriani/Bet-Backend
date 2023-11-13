import participantService from '../services/participant-service';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

async function createParticipant(req: Request, res: Response, next: NextFunction) {
  const { name, balance } = req.body;

  try {
    const participant = await participantService.createParticipant(name, Number(balance));

    res.status(httpStatus.CREATED).send(participant);
  } catch (err) {
    next(err);
  }
}

async function getParticipants(req: Request, res: Response, next: NextFunction) {
  try {
    const participants = await participantService.getParticipants();

    res.status(httpStatus.OK).send(participants);
  } catch (err) {
    next(err);
  }
}

const participantController = {
  createParticipant,
  getParticipants,
};

export default participantController;
