const db = require('../db/connection')
const format = require('pg-format')

exports.fetchCommentsById = async (id) => {
    const { rows } = await db.query(`
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        `,[id])
    return rows
}

exports.addCommentById = async (id, { username, body }) => {
    if(username && body){
        const commentToAdd = format(`
            INSERT INTO comments (article_id, body, author)
            VALUES %L
            RETURNING *;
            `, [[id, body, username]])

        const { rows } = await db.query(commentToAdd)
        return rows[0]
    } else {
        return Promise.reject({status: 400, msg: 'Invalid comment'})
    }
}

exports.removeComment = async (id) => {
    await db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        `, [id])
    
}