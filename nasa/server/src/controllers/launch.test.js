const request = require('supertest')
const app = require('../app')

describe("Get /launch", () => {
    test("testing getting launches the response should be 200", async () => {
        const response = await request(app).get("/launch")
        expect(response.statusCode).toBe(200)
    })
})

