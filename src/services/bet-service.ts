import { badRequestError } from "@/errors";
import betRepository from "@/repositories/bet-repository";
import gameRepository from "@/repositories/game-repository";
import participantRepository from "@/repositories/participant-repository";


async function createBet(
  gameId: number,
  participantId: number,
  homeTeamScore: number,
  awayTeamScore: number,
  amountBet: number,
) {
  const game = await gameRepository.getGameById(gameId);
  if (!game) throw badRequestError('Jogo não encontrado');
  if (game.isFinished === true) throw badRequestError('O jogo ja foi finalizado');

  const participant = await participantRepository.getParticipantById(participantId);
  if (!participant) throw badRequestError('Participante não encontrado');
  if (participant.balance < amountBet) throw badRequestError('Saldo insuficiente');

  const bet = await betRepository.createBet(gameId, participantId, homeTeamScore, awayTeamScore, amountBet);

  const newBalance = participant.balance - amountBet;

  const participantUpdated = await participantRepository.updateParticipantBalance(participantId, newBalance);

  console.log(participantUpdated);

  return bet;
}

const betService = {
  createBet,
};

export default betService;
