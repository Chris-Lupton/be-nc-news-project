const { fetchArticleById } = require("../models/articles.models")
const { fetchCommentsById, addCommentById } = require("../models/comments.models")
const { checkExists } = require('../models/utils')

exports.getCommentsByArticleId = async (request, response, next) => {
    const { article_id } = request.params
    try{
        const [comments, _] = await Promise.all([fetchCommentsById(article_id), fetchArticleById(article_id)])
        response.status(200).send({ comments })
    } catch (err) {
        next(err)
    }  
}

exports.postCommentByArticleId = async (request, response, next) => {
    const { article_id } = request.params
    const { body } = request
    try { 
        const [_, comment] = await Promise.all([
            checkExists('articles', 'article_id', article_id),
            addCommentById(article_id, body) 
        ])
        response.status(201).send({ comment })
    } catch (err) {
        next(err)
    }  
}