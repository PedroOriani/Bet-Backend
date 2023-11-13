import supertest from "supertest";
import app from "../../src/app";
import prisma from "../../src/config/database";
import { createParticipant } from "../factories/participant-factory";
import { faker } from '@faker-js/faker';
import httpStatus from "http-status";
import { createGame } from "../factories/game-factory";
import { createBet } from "../factories/bet-factory";

const api = supertest(app)

describe("POST /games", () => {

    beforeEach(async() => {
        await prisma.bet.deleteMany()
        await prisma.game.deleteMany()
        await prisma.participant.deleteMany()
    })

    it("Should return status 201 and return a object when there is a valid data", async() => {

        const validBody = {
            homeTeamName: faker.location.city(),
	        awayTeamName: faker.location.city(),
        }

        console.log(validBody)

        const {status, body} = await api.post('/games').send(validBody);
        expect(status).toBe(httpStatus.CREATED)
        expect(body).toEqual({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            homeTeamName: validBody.homeTeamName,
            awayTeamName: validBody.awayTeamName,
            homeTeamScore: 0,
            awayTeamScore: 0,
            isFinished: false
        })
    })
})

describe("GET /games", () => {

    beforeEach(async() => {
        await prisma.bet.deleteMany()
        await prisma.game.deleteMany()
        await prisma.participant.deleteMany()
    })

    it("Should return status 400 and when there is no game", async() => {

        const {status, text} = await api.get('/games');
        expect(status).toBe(httpStatus.BAD_REQUEST)
        expect(text).toBe("{\"message\":\"Não tem jogos cadastrados\"}")
    })

    it("Should return status 200 and return a object", async() => {

        await createGame()
        await createGame()

        const {status, body} = await api.get('/games');
        expect(status).toBe(httpStatus.OK)
        expect(body).toHaveLength(2)
    })
})


describe("GET /games/:id", () => {

    beforeEach(async() => {
        await prisma.bet.deleteMany()
        await prisma.game.deleteMany()
        await prisma.participant.deleteMany()
    })

    it("Should return status 404 and when there is no game", async() => {

        const {status} = await api.get(`/games/2`);
        expect(status).toBe(httpStatus.NOT_FOUND)
    })

    it("Should return status 200 and return a object", async() => {

        const participant = await createParticipant()
        const game = await createGame()

        const bet = await createBet(game.id, participant.id, participant.balance-100)

        const {status, body} = await api.get(`/games/${game.id}`);
        expect(status).toBe(httpStatus.OK)
        expect(body).toEqual({
            id: game.id,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            homeTeamName: game.homeTeamName,
            awayTeamName: game.awayTeamName,
            homeTeamScore: game.homeTeamScore,
            awayTeamScore: game.awayTeamScore,
            isFinished: false,
            Bet: [{
                id: bet.id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                homeTeamScore: bet.homeTeamScore,
                awayTeamScore: bet.awayTeamScore,
                amountBet: bet.amountBet, // representado em centavos, ou seja, R$ 10,00 -> 1000
                gameId: game.id, 
                participantId: participant.id,
                status: 'PENDING', // podendo ser PENDING, WON ou LOST
                amountWon: null, // nulo quando a aposta ainda está PENDING; number caso a aposta já esteja WON ou LOST, com o valor ganho representado em centavos
            }]})
    })
})