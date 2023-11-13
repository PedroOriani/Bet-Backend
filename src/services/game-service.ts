import { Prisma, Bet } from '@prisma/client';
import { badRequestError, notFoundError } from '@/errors';
import betRepository from '@/repositories/bet-repository';
import participantRepository from '@/repositories/participant-repository';
import gameRepository from '@/repositories/game-repository';


type GameWithBets = Prisma.GameGetPayload<{
  include: { Bet: true };
}> & { Bet: Bet[] };

type bet = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  homeTeamScore: number;
  awayTeamScore: number;
  amountBet: number;
  gameId: number;
  participantId: number;
  status: string;
  amountWon: number;
}

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

  if (games.length === 0) throw notFoundError();

  return games;
}

async function getGameById(id: number) {
  const game = await gameRepository.getGameById(id);

  if (!game) throw notFoundError();

  return game;
}

async function calculateWins(game: GameWithBets, homeTeamScore: number, awayTeamScore: number) {
  const wins: bet[] = [];

  let totalBet = 0;

  let totalBetWon = 0;

  game.Bet.forEach(async (b: bet) => {
    totalBet += b.amountBet;

    if (b.homeTeamScore === homeTeamScore && b.awayTeamScore === awayTeamScore) {
      wins.push(b);

      totalBetWon += b.amountBet;
    } else {
      await betRepository.updateBet(b.id, 'LOST', 0);
    }
  });

  wins.forEach(async (b) => {
    const valueWon = (b.amountBet / totalBetWon) * totalBet * 0.7;
    console.log(`${b.participantId} Won: ${valueWon}`);

    const updatedBet = await betRepository.updateBet(b.id, 'WON', valueWon);
    console.log(updatedBet);

    const participant = await participantRepository.getParticipantById(b.participantId);

    const newBalance = Math.floor(participant.balance + valueWon);

    const updatedBalance = await participantRepository.updateParticipantBalance(participant.id, newBalance);
    console.log(updatedBalance);
  });
}

const gameService = {
  createGame,
  finishGame,
  getGames,
  getGameById,
};

export default gameService;
