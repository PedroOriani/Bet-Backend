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
