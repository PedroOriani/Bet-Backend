import { Prisma, Bet } from '@prisma/client';
import { badRequestError, notFoundError } from '../errors';
import betRepository from '../repositories/bet-repository';
import participantRepository from '../repositories/participant-repository';
import gameRepository from '../repositories/game-repository';

type GameWithBets = Prisma.GameGetPayload<{
  include: { bets: true };
}> & { bets: Bet[] };

async function createGame(homeTeamName: string, awayTeamName: string) {
  return await gameRepository.createGame(homeTeamName, awayTeamName);
}

async function finishGame(homeTeamScore: number, awayTeamScore: number, id: number) {
  const game = await gameRepository.getGameById(id);

  if (!game) throw notFoundError();

  if (game.isFinished === true) throw badRequestError('O jogo já foi finalizado');

  const finishedGame = await gameRepository.finishGame(homeTeamScore, awayTeamScore, id);

  await calculateWins(game, homeTeamScore, awayTeamScore);

  return finishedGame;
}

async function getGames() {
  const games = await gameRepository.getGames();

  if (games.length === 0) throw badRequestError('Não tem jogos cadastrados');

  return games;
}

async function getGameById(id: number) {
  const game = await gameRepository.getGameById(id);

  if (!game) throw notFoundError();

  return game;
}

async function calculateWins(game: GameWithBets, homeTeamScore: number, awayTeamScore: number) {
  const wins: Bet[] = [];

  let totalBet = 0;

  let totalBetWon = 0;

  game.bets.forEach(async (b: Bet) => {
    totalBet += b.amountBet;

    if (b.homeTeamScore === homeTeamScore && b.awayTeamScore === awayTeamScore) {
      wins.push(b);

      totalBetWon += b.amountBet;
    } else {
      await betRepository.updateBet(b.id, 'LOST', 0);
    }
  });

  await updateBetAndBalance(wins, totalBet, totalBetWon);
}

async function updateBetAndBalance(wins: Bet[], totalBet: number, totalBetWon: number) {
  const fee = 0.3;

  wins.forEach(async (b) => {
    const valueWon = (b.amountBet / totalBetWon) * totalBet * (1 - fee);

    await betRepository.updateBet(b.id, 'WON', valueWon);

    const participant = await participantRepository.getParticipantById(b.participantId);

    const newBalance = Math.floor(participant.balance + valueWon);

    await participantRepository.updateParticipantBalance(participant.id, newBalance);
  });
}

const gameService = {
  createGame,
  finishGame,
  getGames,
  getGameById,
};

export default gameService;
