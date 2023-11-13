import betService from '../services/bet-service';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';


async function createBet(req: Request, res: Response, next: NextFunction) {
  const { gameId, participantId, homeTeamScore, awayTeamScore, amountBet } = req.body;

  try {
    const bet = await betService.createBet(gameId, participantId, homeTeamScore, awayTeamScore, amountBet);

    res.status(httpStatus.CREATED).send(bet);
  } catch (err) {
    next(err);
  }
}

const betController = {
  createBet,
};

export default betController;
