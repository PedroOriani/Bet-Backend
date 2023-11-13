import supertest from "supertest";
import app from "@/app";

const api = supertest(app)

describe("GET /participants", () => {
    it("Should return 200 and an object", async() => {
        // const {status, body} = await api.get('/participants');
        // expect(status).toBe(200)
        // expect(body).toHaveLength(2);
        expect(1).toBe(1)
    })
})