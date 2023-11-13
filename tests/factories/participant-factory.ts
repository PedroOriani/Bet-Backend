import prisma from "../../src/config/database";
import { faker } from '@faker-js/faker';

export async function createParticipant() {
    return await prisma.participant.create({
        data: {
            name: faker.person.firstName(),
            balance: faker.number.int({min: 1000, max: 5000})
        }
    })
}