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

describe('/api/articles', () => {
    test('200: Should return an array of articles', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles")
            .expect(200)
        expect(articles).toHaveLength(13)
        articles.forEach(article => {
            expect(article).toHaveProperty("author", expect.any(String))
            expect(article).toHaveProperty("title", expect.any(String))
            expect(article).toHaveProperty("article_id", expect.any(Number))
            expect(article).toHaveProperty("votes", expect.any(Number))
            expect(article).toHaveProperty("topic", expect.any(String))
            expect(article).toHaveProperty("created_at", expect.any(String))
            expect(article).toHaveProperty("article_img_url", expect.any(String))
            expect(article).toHaveProperty("comment_count", expect.any(String))
        })
    })
    test('200: The articles should be sorted by date in descending order', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles")
            .expect(200)
        articles.forEach(article => {
            article.created_at  = Date.parse(article.created_at)
        })
        expect(articles).toBeSortedBy('created_at', {coerce: true, descending:true})
    })
})

describe('/notapath', () => {
    test('404: should return "Not found" if the requested path is not valid', async () => {
        const { body: { msg } } = await request(app)
            .get('/api/cats')
            .expect(404)
        expect(msg).toBe('Not found')
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('200: Should return an array of comments for the given article_id sorted by newest first', async () => {
        const { body: { comments } } = await request(app)
            .get("/api/articles/1/comments")
            .expect(200)
        expect(comments).toHaveLength(11)
        comments.forEach(comment => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number))
            expect(comment).toHaveProperty("votes", expect.any(Number))
            expect(comment).toHaveProperty("created_at", expect.any(String))
            expect(comment).toHaveProperty("author", expect.any(String))
            expect(comment).toHaveProperty("body", expect.any(String))
            expect(comment).toHaveProperty("article_id", expect.any(Number))
            comment.created_at = Date.parse(comment.created_at)
        })
        expect(comments).toBeSortedBy('created_at', {coerce: true, descending:true})
    })
    test('200: Should return an empty array if the article id exists but there are no comments', async () => {
        const { body: { comments } } = await request(app)
            .get("/api/articles/2/comments")
            .expect(200)
        expect(comments).toEqual([])
    })
    test('404: Should return "Article not found" if there are no articles matching the requested id', async () => {
        const { body: { msg }} = await request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
        expect(msg).toBe("Article not found")
    })
    test('400: Should return "Bad request" if the requested id is not a valid number', async () => {
        const { body: { msg }} = await request(app)
            .get('/api/articles/hello/comments')
            .expect(400)
        expect(msg).toBe("Bad request")
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('201: Should post a comment to the given article id and respond with the posted comment', async () => {
        const testComment = {username: 'butter_bridge', body: 'testBody'}
        const { body: { comment } } = await request(app)
            .post('/api/articles/1/comments')
            .send(testComment)
            .expect(201)
        expect(comment).toHaveProperty('article_id', 1)
        expect(comment).toHaveProperty('comment_id', 19)
        expect(comment).toHaveProperty('author', 'butter_bridge')
        expect(comment).toHaveProperty('body', 'testBody')
        expect(comment).toHaveProperty('votes', 0)
        expect(comment).toHaveProperty('created_at', expect.any(String))
    })
    test('400: Should return "Bad request" if the requested id is not a valid number', async () => {
        const testComment = {username: 'butter_bridge', body: 'testBody'}
        const { body: { msg }} = await request(app)
            .post('/api/articles/hello/comments')
            .send(testComment)
            .expect(400)
        expect(msg).toBe("Bad request")
    })
    test('400: Should return "Invalid comment" if the posted comment does not have body and username', async () => {
        const testComment = {body: 'testBody'}
        const { body: { msg }} = await request(app)
            .post('/api/articles/1/comments')
            .send(testComment)
            .expect(400)
        expect(msg).toBe("Invalid comment")
    })
    test('404: Should return "Resource not found" if there are no articles matching the requested id', async () => {
        const testComment = {username: 'butter_bridge', body: 'testBody'}
        const { body: { msg }} = await request(app)
            .post('/api/articles/9999/comments')
            .send(testComment)
            .expect(404)
        expect(msg).toBe('Resource not found')
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('200: Should update the votes on the requested article_id by the given value and return the updated article', async () => {
        const testVotes = { inc_votes: 1 }
        const { body: { article } } = await request(app)
            .patch("/api/articles/1")
            .send(testVotes)
            .expect(200)
        expect(article).toHaveProperty("article_id", 1)
        expect(article).toHaveProperty("votes", 101)  
    })
    test('400: Should return "Bad request" if the requested id is not a valid number', async () => {
        const testVotes = { inc_votes: 1 }
        const { body: { msg }} = await request(app)
        .patch("/api/articles/hello")
            .send(testVotes)
            .expect(400)
        expect(msg).toBe("Bad request")
    })
    test('400: Should return "Invalid votes" if the updated votes does not have inc_votes', async () => {
        const testVotes = { new: 1 }
        const { body: { msg }} = await request(app)
            .patch("/api/articles/1")
            .send(testVotes)
            .expect(400)
        expect(msg).toBe("Invalid votes")
    })
    test('404: Should return "Resource not found" if there are no articles matching the requested id', async () => {
        const testVotes = { inc_votes: 1 }
        const { body: { msg }} = await request(app)
        .patch("/api/articles/9999")
            .send(testVotes)
            .expect(404)
        expect(msg).toBe('Resource not found')
    })
})