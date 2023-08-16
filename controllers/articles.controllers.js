const { fetchArticleById, fetchArticles, updateArticle } = require("../models/articles.models")
const { checkExists } = require('../models/utils')

exports.getArticleById = async (request, response, next) => {
    const { article_id } = request.params
    try {
        const article = await fetchArticleById(article_id)
        response.status(200).send({ article })
    } catch (err) {
        next(err)
    }
}

exports.getArticles = async (request, response, next) => {
    const { topic, sort_by, order } = request.query
    const promises = [fetchArticles(topic, sort_by, order)]
    if (topic) promises.push(checkExists('articles', 'topic', topic))
    try{ 
        const [articles, _] = await Promise.all(promises)        
        response.status(200).send({ articles })
    } catch (err) {
        next(err)
    }
}

exports.patchArticle = async (request, response, next) => {
    const { article_id } = request.params
    const { body } = request
    try {
        const [_, article] = await Promise.all([
            checkExists('articles', 'article_id', article_id),
            updateArticle(article_id, body)
        ])
        response.status(200).send({ article })
    } catch (err) {
        next(err)
    }
}