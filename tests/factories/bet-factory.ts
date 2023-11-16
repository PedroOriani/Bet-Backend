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
