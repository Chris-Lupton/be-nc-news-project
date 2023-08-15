const db = require('../db/connection')

exports.fetchCommentsById = async (id) => {
    const { rows } = await db.query(`
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        `,[id])
    return rows
}