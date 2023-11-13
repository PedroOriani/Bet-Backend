import supertest from "supertest";
import app from "../../src/app";
import prisma from "../../src/config/database";
import { createParticipant } from "../factories/participant-factory";
import { faker } from '@faker-js/faker';
import httpStatus from "http-status";
import { createFinishedGame, createGame } from "../factories/game-factory";

const api = supertest(app)

describe("POST /bets", () => {

    beforeEach(async() => {
        await prisma.bet.deleteMany()
        await prisma.game.deleteMany()
        await prisma.participant.deleteMany()
    })

    it("Should return status 400 when gameId doesnt exist", async() => {

        const participant = await createParticipant()

        const invalidBody = {
            gameId: faker.number.int({min: 1, max: 10}),
            participantId: participant.id,
            homeTeamScore: faker.number.int({min: 1, max: 10}),
            awayTeamScore: faker.number.int({min: 1, max: 10}),
            amountBet: faker.number.int({min: 100, max: 1000}),
        }

        const {status, text} = await api.post('/bets').send(invalidBody);
        expect(status).toBe(httpStatus.BAD_REQUEST)
        expect(text).toBe("{\"message\":\"Jogo não encontrado\"}")
    })

    it("Should return status 400 when game is finished", async() => {

        const game = await createFinishedGame()

        const invalidBody = {
            gameId: game.id,
            participantId: faker.number.int({min: 1, max: 10}),
            homeTeamScore: faker.number.int({min: 1, max: 10}),
            awayTeamScore: faker.number.int({min: 1, max: 10}),
            amountBet: faker.number.int({min: 100, max: 1000}),
        }

        const {status, text} = await api.post('/bets').send(invalidBody);
        expect(status).toBe(httpStatus.BAD_REQUEST)
        expect(text).toBe("{\"message\":\"O jogo ja foi finalizado\"}")
    })

    it("Should return status 400 when participantId doesnt exist", async() => {

        const game = await createGame()

        const invalidBody = {
            gameId: game.id,
            participantId: faker.number.int({min: 1, max: 10}),
            homeTeamScore: faker.number.int({min: 1, max: 10}),
            awayTeamScore: faker.number.int({min: 1, max: 10}),
            amountBet: faker.number.int({min: 100, max: 1000}),
        }

        const {status, text} = await api.post('/bets').send(invalidBody);
        expect(status).toBe(httpStatus.BAD_REQUEST)
        expect(text).toBe("{\"message\":\"Participante não encontrado\"}")
    })

    it("Should return status 400 when amountBet is less than balance", async() => {

        const participant = await createParticipant()
        const game = await createGame()

        const invalidBody = {
            gameId: game.id,
            participantId: participant.id,
            homeTeamScore: faker.number.int({min: 1, max: 10}),
            awayTeamScore: faker.number.int({min: 1, max: 10}),
            amountBet: 10001,
        }

        const {status, text} = await api.post('/bets').send(invalidBody);
        expect(status).toBe(httpStatus.BAD_REQUEST)
        expect(text).toBe("{\"message\":\"Saldo insuficiente\"}")
    })

    it("Should return status 201 when return an object when there is a valid data", async() => {

        const participant = await createParticipant()
        const game = await createGame()

        const validBody = {
            gameId: game.id,
            participantId: participant.id,
            homeTeamScore: faker.number.int({min: 1, max: 10}),
            awayTeamScore: faker.number.int({min: 1, max: 10}),
            amountBet: participant.balance - 1000,
        }

        const {status, body} = await api.post('/bets').send(validBody);
        expect(status).toBe(httpStatus.CREATED)
        expect(body).toEqual({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            homeTeamScore: validBody.homeTeamScore,
            awayTeamScore: validBody.awayTeamScore,
            amountBet: validBody.amountBet,
            gameId: game.id, 
            participantId: participant.id,
            status: 'PENDING', 
            amountWon: null
    })
})

})