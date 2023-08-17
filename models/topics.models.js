const db = require('../db/connection')
const format = require('pg-format')

exports.fetchTopics = async () => {
    const { rows } = await db.query(`SELECT * FROM topics`)
    return rows
}

exports.addTopic = async ({ topic, description }) => {
    if(topic){

        const topicToAdd = format(`
            INSERT INTO topics (slug, description)
            VALUES %L
            RETURNING *
            `, [[topic, description]])
        const { rows } = await db.query(topicToAdd)
        return rows[0]
        
    } else {
        return Promise.reject({status: 400, msg: 'No topic given'})
    }
}