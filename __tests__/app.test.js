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
    test('200: Should return the article with a total comment count', async () => {
        const { body: { article } } = await request(app)
            .get('/api/articles/1')
            .expect(200)
        expect(article).toHaveProperty('article_id', 1)
        expect(article).toHaveProperty('comment_count', '11')
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
    test('200: Should return an array of comments for the given article_id sorted by newest first(limit to 10 results by default)', async () => {
        const { body: { comments } } = await request(app)
            .get("/api/articles/1/comments")
            .expect(200)
        expect(comments).toHaveLength(10)
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

describe('DELETE /api/comments/:comment_id', () => {
    test('204: Should delete the comment with the given id and return no content', async () => {
        await request(app)
            .delete('/api/comments/1')
            .expect(204)
    })
    test('400: Should return 400 if the requested id is not a valid number', async () => {
        await request(app)
            .delete('/api/comments/hello')
            .expect(400)
    })
    test('404: Should return 404 if there are no articles matching the requested id', async () => {
        await request(app)
            .delete('/api/comments/9999')
            .expect(404)
    })
})

describe('GET /api/users', () => {
    test('200: Should respond with an array of all users with properties: username, name and avatar_url', async () => {
        const { body: { users } } = await request(app)
            .get("/api/users")
            .expect(200)
        expect(users).toHaveLength(4)
        users.forEach(user => {
            expect(user).toHaveProperty("username", expect.any(String))
            expect(user).toHaveProperty("name", expect.any(String))
            expect(user).toHaveProperty("avatar_url", expect.any(String))
        })
    })
})

describe('GET /api/articles (queries)', () => {
    test('200: Should filter articles by a topic given in a query', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
        expect(articles).toHaveLength(1)
        articles.forEach(article => {
            expect(article.topic).toBe('cats')
        })
    })
    test('200: Should sort the articles by any valid column given and default to descending', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
        expect(articles).toHaveLength(13)
        expect(articles).toBeSortedBy('title', {descending: true})
    })
    test('200: Should sort the articles by the order given', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
        expect(articles).toHaveLength(13)
        expect(articles).toBeSortedBy('title', {ascending: true})
    })
    test('200: Should filter and sort the articles when given a valid topic, column and order', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?topic=mitch&sort_by=author&order=asc")
            .expect(200)
        expect(articles).toHaveLength(12)
        articles.forEach(article => {
            expect(article.topic).toBe('mitch')
        })
        expect(articles).toBeSortedBy('author', {ascending: true})
    })
    test('200: Should return an empty array if the topic is valid but there are no results', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
        expect(articles).toEqual([])
    })
    test('404: Should return "Resource not found" if given a topic that doesn\'t exist', async () => {
        const { body: { msg }} = await request(app)
            .get("/api/articles?topic=hello")
            .expect(404)
        expect(msg).toBe('Resource not found')
    })
    test('400: Should return "Invalid sort query" if given an invalid column to sort_by', async () => {
        const { body: { msg }} = await request(app)
            .get("/api/articles?sort_by=bananas")
            .expect(400)
        expect(msg).toBe('Invalid sort query')
    })
    test('400: Should return "Invalid sort query" if given an invalid order', async () => {
        const { body: { msg }} = await request(app)
            .get("/api/articles?order=cats")
            .expect(400)
        expect(msg).toBe('Invalid sort query')
    })
})

describe('GET /api/users/:username', () => {
    test('200: Should respond with a user object with properties: username, avatar_url and name when given a valid username', async () => {
        const { body: { user } } = await request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
        expect(user).toHaveProperty("username", 'butter_bridge')
        expect(user).toHaveProperty("name", 'jonny')
        expect(user).toHaveProperty("avatar_url", 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')
    })
    test('404: Should respond with "User not found" if given a username that doesn\'t exist', async () => {
        const { body: { msg }} = await request(app)
        .get("/api/users/notauser")
        .expect(404)
    expect(msg).toBe('User not found')
    })
})

describe('PATCH /api/comments/:comment_id', () => {
    test('200: Should update the votes on the requested comment_id by the given value and return the updated comment', async () => {
        const testVotes = { inc_votes: 1 }
        const { body: { comment } } = await request(app)
            .patch("/api/comments/1")
            .send(testVotes)
            .expect(200)
        expect(comment).toHaveProperty("comment_id", 1)
        expect(comment).toHaveProperty("votes", 17)  
    })
    test('400: Should return "Bad request" if the requested id is not a valid number', async () => {
        const testVotes = { inc_votes: 1 }
        const { body: { msg }} = await request(app)
        .patch("/api/comments/notacomment")
            .send(testVotes)
            .expect(400)
        expect(msg).toBe("Bad request")
    })
    test('400: Should return "Invalid votes" if the updated votes does not have inc_votes', async () => {
        const testVotes = { new: 1 }
        const { body: { msg }} = await request(app)
            .patch("/api/comments/1")
            .send(testVotes)
            .expect(400)
        expect(msg).toBe("Invalid votes")
    })
    test('404: Should return "Resource not found" if there are no comments matching the requested id', async () => {
        const testVotes = { inc_votes: 1 }
        const { body: { msg }} = await request(app)
        .patch("/api/comments/9999")
            .send(testVotes)
            .expect(404)
        expect(msg).toBe('Resource not found')
    })
})

describe('POST /api/articles', () => {
    test('201: Should post a new article to the database if given valid data and return the added article', async () => {
        const testArticle = {author: 'butter_bridge', title: 'testTitle', body: 'testBody', topic: 'cats'}
        const { body: { article } } = await request(app)
            .post('/api/articles/')
            .send(testArticle)
            .expect(201)
        expect(article).toHaveProperty('article_id', 14)
        expect(article).toHaveProperty('author', 'butter_bridge')
        expect(article).toHaveProperty('title', 'testTitle')
        expect(article).toHaveProperty('body', 'testBody')
        expect(article).toHaveProperty('topic', 'cats')
        expect(article).toHaveProperty('votes', 0)
        expect(article).toHaveProperty('comment_count', '0')
        expect(article).toHaveProperty('created_at', expect.any(String))
    })
    test('201: Should post a new article and create a new topic if the topic given is not already in topics', async () => {
        const testArticle = {author: 'butter_bridge', title: 'testTitle', body: 'testBody', topic: 'new_topic'}
        const { body: { article, topic }} = await request(app)
            .post('/api/articles')
            .send(testArticle)
            .expect(201)
        expect(article).toHaveProperty('author', 'butter_bridge')
        expect(article).toHaveProperty('article_id', 14)
        expect(topic).toHaveProperty('slug', 'new_topic')
        expect(topic).toHaveProperty('description', null )
    })
    test('422: Should respond with "Missing article data" if the post request is missing title', async () => {
        const testArticle = {author: 'butter_bridge', body: 'testBody', topic: 'new_topic'}
        const { body: { msg }} = await request(app)
            .post('/api/articles')
            .send(testArticle)
            .expect(422)
        expect(msg).toBe("Missing article data")
    })
    test('422: Should respond with "Missing article data" if the post request is missing body', async () => {
        const testArticle = {author: 'butter_bridge', title: 'testTitle', topic: 'new_topic'}
        const { body: { msg }} = await request(app)
            .post('/api/articles')
            .send(testArticle)
            .expect(422)
        expect(msg).toBe("Missing article data")
    })
    test('422: Should respond with "Missing topic" if topic is not given', async () => {
        const testArticle = {author: 'butter_bridge', title: 'testTitle', body: 'testBody'}
        const { body: { msg }} = await request(app)
            .post('/api/articles')
            .send(testArticle)
            .expect(422)
        expect(msg).toBe("Missing topic")
    })
    test('404: Should respond with "User not found" if author is not given or does not exist in users table', async () => {
        const testArticle = {author: 'not_a_user', title: 'testTitle', body: 'testBody', topic: 'new_topic'}
        const { body: { msg }} = await request(app)
            .post('/api/articles')
            .send(testArticle)
            .expect(404)
        expect(msg).toBe("User not found")
    })
})

describe('POST /api/topics', () => {
    test('201: Should post a new topic if given a slug without description', async () => {
        const testTopic = { topic: 'testTopic' }
        const { body: { topic }} = await request(app)
            .post('/api/topics')
            .send(testTopic)
            .expect(201)
        expect(topic).toHaveProperty('slug', 'testTopic')
        expect(topic).toHaveProperty('description', null )
    })
    test('201: Should post a new topic if given a slug with a description', async () => {
        const testTopic = { topic: 'testTopic2', description: 'test_description' }
        const { body: { topic }} = await request(app)
            .post('/api/topics')
            .send(testTopic)
            .expect(201)
        expect(topic).toHaveProperty('slug', 'testTopic2')
        expect(topic).toHaveProperty('description', 'test_description')
    })
    test('400: Should respond with "No topic given" is the topic is not defined', async () => {
        const testTopic = {description: 'test_description' }
        const { body: { msg }} = await request(app)
            .post('/api/topics')
            .send(testTopic)
            .expect(400)
        expect(msg).toBe('No topic given')
    })
})

describe('GET /api/articles (pagination)', () => {
    test('200: Should accept a limit query and return the limited number of articles', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?limit=5")
            .expect(200)
        expect(articles).toHaveLength(5)
        expect(articles[0]).toHaveProperty("article_id", 3)
        expect(articles[4]).toHaveProperty("article_id", 12)
    })
    test('200: Should return all articles if given an invalid limit', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?limit=droptable")
            .expect(200)
        expect(articles).toHaveLength(13)
        articles.forEach(article => {       
            expect(article).toHaveProperty("article_id", expect.any(Number))
        })
    })
    test('200: Should accept query p for the page to start at', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?limit=5&p=2")
            .expect(200)
        expect(articles).toHaveLength(5)
        expect(articles[0]).toHaveProperty("article_id", 5)
        expect(articles[4]).toHaveProperty("article_id", 4)
    })
    test('200: Should ignore an invalid p query and return the first page of articles', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?limit=5&p=hello")
            .expect(200)
        expect(articles).toHaveLength(5)
        expect(articles[0]).toHaveProperty("article_id", 3)
        expect(articles[4]).toHaveProperty("article_id", 12)
    })
    test('200: Should return an empty array if there are no results on the page requested', async () => {
        const { body: { articles } } = await request(app)
            .get("/api/articles?limit=5&p=5")
            .expect(200)
        expect(articles).toEqual([])
    })
})

describe('GET /api/articles/:article_id/comments (pagination)', () => {
    test('200: Should accept a limit query and return the limited number of comments', async () => {
        const { body: { comments } } = await request(app)
            .get("/api/articles/1/comments?limit=5")
            .expect(200)
        expect(comments).toHaveLength(5)
        expect(comments[0]).toHaveProperty("comment_id", 5)
        expect(comments[4]).toHaveProperty("comment_id", 7)
    })
    test('200: Should return a default of 10 comments if no limit given', async () => {
        const { body: { comments } } = await request(app)
            .get("/api/articles/1/comments")
            .expect(200)
        expect(comments).toHaveLength(10)
        comments.forEach(comment => {       
            expect(comment).toHaveProperty("comment_id", expect.any(Number))
        })
    })
    test('200: Should return all comments if given an invalid limit', async () => {
        const { body: { comments } } = await request(app)
            .get("/api/articles/1/comments?limit=hello")
            .expect(200)
        expect(comments).toHaveLength(11)
        comments.forEach(comment => {       
            expect(comment).toHaveProperty("comment_id", expect.any(Number))
        })
    })
    test('200: Should accept query p for the page to start at', async () => {
        const { body: { comments } } = await request(app)
            .get("/api/articles/1/comments?limit=5&p=2")
            .expect(200)
        expect(comments).toHaveLength(5)
        expect(comments[0]).toHaveProperty("comment_id", 8)
        expect(comments[4]).toHaveProperty("comment_id", 4)
    })
    test('200: Should ignore an invalid p query and return the first page of articles', async () => {
        const { body: { comments } } = await request(app)
            .get("/api/articles/1/comments?limit=5&p=bananas")
            .expect(200)
        expect(comments).toHaveLength(5)
        expect(comments[0]).toHaveProperty("comment_id", 5)
        expect(comments[4]).toHaveProperty("comment_id", 7)
    })
    test('200: Should return an empty array if there are no results on the page requested', async () => {
        const { body: { comments } } = await request(app)
            .get("/api/articles/1/comments?limit=5&p=5")
            .expect(200)
        expect(comments).toEqual([])
    })
})