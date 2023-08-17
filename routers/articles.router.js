const { getArticleById, getArticles, patchArticle, postArticle } = require('../controllers/articles.controllers')
const { getCommentsByArticleId, postCommentByArticleId } = require('../controllers/comments.controllers')

const articlesRouter = require('express').Router()

articlesRouter.get('/:article_id', getArticleById)

articlesRouter.get('/', getArticles)

articlesRouter.get('/:article_id/comments', getCommentsByArticleId)

articlesRouter.post('/:article_id/comments', postCommentByArticleId)

articlesRouter.patch('/:article_id', patchArticle)

articlesRouter.post('/', postArticle)

module.exports = articlesRouter