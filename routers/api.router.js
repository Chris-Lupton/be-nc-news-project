const { getEndpoints } = require('../controllers/api.controllers')
const topicsRouter = require('./topics.router')
const usersRouter = require('./users.router')
const articlesRouter = require('./articles.router')
const commentsRouter = require('./comments.router')

const apiRouter = require('express').Router()

apiRouter.get('/', getEndpoints)

apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter