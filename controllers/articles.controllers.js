const { fetchArticleById, fetchArticle } = require("../models/articles.models")

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
    const articles = await fetchArticle()
    response.status(200).send({ articles })
}