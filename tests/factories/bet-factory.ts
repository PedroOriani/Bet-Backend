import { faker } from '@faker-js/faker';
import prisma from '../../src/config/database';

export async function createBet(gameId: number, participantId: number, amountBet: number) {
  const bet = await prisma.bet.create({
    data: {
      homeTeamScore: faker.number.int({ min: 0, max: 10 }),
      awayTeamScore: faker.number.int({ min: 0, max: 10 }),
      amountBet: amountBet,
      gameId: gameId,
      participantId: participantId,
    },
  });

  return bet;
}

export async function createBetWithScores(
  gameId: number,
  participantId: number,
  amountBet: number,
  homeTeamScore: number,
  awayTeamScore: number,
) {
  const bet = await prisma.bet.create({
    data: {
      homeTeamScore: homeTeamScore,
      awayTeamScore: awayTeamScore,
      amountBet: amountBet,
      gameId: gameId,
      participantId: participantId,
    },
  });

  return bet;
}

export async function getBetById(id: number) {
  const bet = await prisma.bet.findUnique({
    where: {
      id,
    },
  });

  return bet;
}
