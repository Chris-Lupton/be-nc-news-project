const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getArticleById } = require("./controllers/articles.controllers")
const { handleCustomErrors, handleSqlErrors } = require("./controllers/errors.controllers")

const app = express()

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.use(handleCustomErrors)

app.use(handleSqlErrors)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: err })
})

module.exports = app
