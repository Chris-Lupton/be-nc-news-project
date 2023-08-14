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
    test("200: Should return a status 200", () => {
        return request(app).get("/api/topics").expect(200)
    })
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

describe('/api/articles/:article_id', () => {
    test('200: Should respond with the article matching the requested id', async () => {
        const { body: { article } } = await request(app)
            .get('/api/articles/1')
            .expect(200)
        expect(article).toHaveProperty('article_id', 1)
        expect(article).toHaveProperty('author', "butter_bridge")
        expect(article).toHaveProperty('title', 'Living in the shadow of a great man')
        expect(article).toHaveProperty('body', "I find this existence challenging")
        expect(article).toHaveProperty('topic', "mitch")
        expect(article).toHaveProperty('created_at', "2020-07-09T20:11:00.000Z")
        expect(article).toHaveProperty('votes', 100)
        expect(article).toHaveProperty('article_img_url', "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
    })
    test('404: Should return "Article not found" if there are no articles matching the requested id', async () => {
        const { body: { msg }} = await request(app)
            .get('/api/articles/9999')
            .expect(404)
        expect(msg).toBe("Article not found")
    })
    test('400: Should return "Bad request" if the requested id is not a valid number', async () => {
        const { body: { msg }} = await request(app)
            .get('/api/articles/hello')
            .expect(400)
        expect(msg).toBe("Bad request")
    })
})