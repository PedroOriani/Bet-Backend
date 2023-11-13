import supertest from "supertest";
import app from "../src/app";
import prisma from "../src/config/database";
import { createParticipant } from "./factories/participant-factory";

const api = supertest(app)

describe("GET /participants", () => {

    beforeEach(async() => {
        await prisma.bet.deleteMany()
        await prisma.participant.deleteMany()
    })

    it("Should return 200 and an object", async() => {

        await createParticipant()
        await createParticipant()

        const {status, body} = await api.get('/participants');
        expect(status).toBe(200)
        expect(body).toHaveLength(2);
    })
})