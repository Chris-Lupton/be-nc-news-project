const express = require("express")
const { handleCustomErrors, handleSqlErrors } = require("./controllers/errors.controllers")
const apiRouter = require('./routers/api.router')

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

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