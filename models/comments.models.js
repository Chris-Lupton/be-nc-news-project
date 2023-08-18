const db = require('../db/connection')
const format = require('pg-format')

exports.fetchCommentsById = async (id, limit = 10, p) => {
    let baseQuery = `
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC `

    if(/^[0-9]+$/.test(limit)){
        baseQuery += `LIMIT ${limit} `
        if(/^[0-9]+$/.test(p)){
            baseQuery += `OFFSET ${limit*(p-1)}`
        }
    }

    const { rows } = await db.query(baseQuery,[id])
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

exports.updateComment = async (id, { inc_votes }) => {
    if(inc_votes){
        const { rows } = await db.query(`
            UPDATE comments
            SET votes = votes + $1
            WHERE comment_id = $2
            RETURNING *
            `, [inc_votes, id])
        return rows[0]
    } else {
        return Promise.reject({status: 400, msg: 'Invalid votes'})
    }

}