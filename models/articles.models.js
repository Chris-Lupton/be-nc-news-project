const db = require('../db/connection')

exports.fetchArticleById = async (id) => {
    const { rows } = await db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" })
    }
    return rows[0]
}