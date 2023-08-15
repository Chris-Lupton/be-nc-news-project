const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")
const { getArticleById, getArticles, patchArticle } = require("./controllers/articles.controllers")
const { handleCustomErrors, handleSqlErrors } = require("./controllers/errors.controllers")
const { getCommentsByArticleId, postCommentByArticleId, deleteComment } = require("./controllers/comments.controllers")

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment)

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
