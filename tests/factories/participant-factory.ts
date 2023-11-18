import { faker } from '@faker-js/faker';
import prisma from '../../src/config/database';

export async function createParticipant() {
  return await prisma.participant.create({
    data: {
      name: faker.person.firstName(),
      balance: faker.number.int({ min: 1001, max: 5000 }),
    },
  });
}

export async function getParticipantById(id: number) {
  const participant = await prisma.participant.findUnique({
    where: {
      id,
    },
  });

  return participant;
}

export async function updateBalance(id: number, balance: number) {
  return await prisma.participant.update({
    where: {
      id,
    },
    data: {
      balance: balance,
    },
  });
}
