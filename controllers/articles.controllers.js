const { fetchArticleById, fetchArticles, updateArticle, addArticle } = require("../models/articles.models")
const { addTopic } = require("../models/topics.models")
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
    if (topic) promises.push(checkExists('topics', 'slug', topic))
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

exports.postArticle = async (request, response, next) => {
    const article = request.body
    try {
        await checkExists('users', 'username', article.author)
        try {
            await checkExists('topics', 'slug', article.topic)
            const newArticleId = await addArticle(article)
            const newArticle = await fetchArticleById(newArticleId)
            response.status(201).send({ article: newArticle })
        } catch {
            if(article.topic){
                const newTopic = await addTopic({topic: article.topic})
                const newArticleId = await addArticle(article)
                const newArticle = await fetchArticleById(newArticleId)
                response.status(201).send({ article: newArticle, topic: newTopic})
            } else {
                response.status(422).send({ msg: 'Missing topic' })
            }
        }
    } catch (err) {
        next(err)
    }
}
