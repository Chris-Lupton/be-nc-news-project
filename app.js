const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")
const { getArticleById, getArticles } = require("./controllers/articles.controllers")
const { handleCustomErrors, handleSqlErrors } = require("./controllers/errors.controllers")
const { getCommentsByArticleId } = require("./controllers/comments.controllers")

const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.use((_, res) => {
    res.status(404).send({ msg: 'Not found' })
})

app.use(handleCustomErrors)

app.use(handleSqlErrors)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: err })
})

module.exports = app
