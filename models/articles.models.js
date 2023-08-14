const db = require('../db/connection')

exports.fetchArticleById = async (id) => {
    const { rows } = await db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" })
    }
    return rows[0]
}

exports.fetchArticle = async () => {
    const { rows } = await db.query(`
            SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC
    `)
    return rows
}
