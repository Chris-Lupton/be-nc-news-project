const app = require("../app")
const request = require("supertest")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")
const db = require("../db/connection")

beforeEach(() => {
    return seed(data)
})
  
afterAll(() => {
    return db.end()
})

describe('/api/topics', () => {
    test('200: Should respond with an array of all topcis with properties: slug and description', async () => {
        const { body: { topics } } = await request(app)
            .get("/api/topics")
            .expect(200)
        expect(topics).toHaveLength(3)
        topics.forEach(topic => {
            expect(topic).toHaveProperty("slug", expect.any(String))
            expect(topic).toHaveProperty("description", expect.any(String))
        })
    })
})

describe('/api', () => {
    test('should return an object with all the available endpoints of the api', async () => {
        const { body: { endpoints } } = await request(app)
            .get('/api')
            .expect(200)
        expect(endpoints).toBeInstanceOf(Object)
        expect(endpoints).toHaveProperty("GET /api")
        expect(endpoints).toHaveProperty("GET /api/topics")
        Object.values(endpoints).forEach(value => {
            expect(value).toHaveProperty('description', expect.any(String))
        })
    })
})