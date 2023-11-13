import supertest from "supertest";
import app from "../../src/app";
import prisma from "../../src/config/database";
import { createParticipant } from "../factories/participant-factory";
import { faker } from '@faker-js/faker';
import httpStatus from "http-status";

const api = supertest(app)

describe("GET /participants", () => {

    beforeEach(async() => {
        await prisma.bet.deleteMany()
        await prisma.participant.deleteMany()
    })

    it("Should return status 200 and an object", async() => {

        await createParticipant()
        await createParticipant()

        const {status, body} = await api.get('/participants');
        expect(status).toBe(httpStatus.OK)
        expect(body).toHaveLength(2);
    })
})

describe("POST /participants", () => {

    beforeEach(async() => {
        await prisma.bet.deleteMany()
        await prisma.participant.deleteMany()
    })

    it("Should return status 422 for invalid data", async() => {

        const invalidBody = {
            name: faker.person.firstName(),
            balance: faker.number.int({max: 999})
        }

        const {status} = await api.post('/participants').send(invalidBody);
        expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })

    it("Should return status 201 and an object for valid data", async() => {

        const validBody = {
            name: faker.person.fullName(),
            balance: faker.number.int({min: 1001, max: 10000})
        }

        const {status, body} = await api.post('/participants').send(validBody);
        expect(status).toBe(httpStatus.CREATED)
        expect(body).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            balance: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        })
    })
})

