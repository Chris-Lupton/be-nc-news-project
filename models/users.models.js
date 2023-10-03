const db = require('../db/connection')
const format = require('pg-format')

exports.fetchUsers = async () => {
    const { rows } = await db.query(`SELECT * FROM users`)
    return rows
}

exports.fetchUserByUsername = async (username) => {
    const { rows } = await db.query(`
        SELECT * FROM users
        WHERE username = $1
        `, [username])
    if(!rows.length){
        return Promise.reject({status: 404, msg: 'User not found'})
    }
    return rows[0]
}

exports.addUser = async ({ username, name, avatar_url }) => {
    if(!name || !username) return Promise.reject({status:400, msg: 'No name given'})

    if(!avatar_url) avatar_url = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?size=626&ext=jpg&ga=GA1.1.1598835678.1696346653&semt=ais'

    const userToAdd = format(`
    INSERT INTO users (username, name, avatar_url)
    VALUES %L
    RETURNING *
    `, [[username, name, avatar_url ]])
    const { rows } = await db.query(userToAdd)
    return rows[0]
}