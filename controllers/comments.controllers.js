const { fetchArticleById } = require("../models/articles.models")
const { fetchCommentsById } = require("../models/comments.models")

exports.getCommentsByArticleId = async (request, response, next) => {
    const { article_id } = request.params
    try{
        const [comments, _] = await Promise.all([fetchCommentsById(article_id), fetchArticleById(article_id)])
        response.status(200).send({ comments })
    } catch (err) {
        next(err)
    }  
}