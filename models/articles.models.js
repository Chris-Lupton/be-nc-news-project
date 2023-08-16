const db = require('../db/connection')

exports.fetchArticleById = async (id) => {
    const { rows } = await db.query(`
        SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
        `, [id])
    if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" })
    }
    return rows[0]
}

exports.fetchArticles = async (topic, sort_by = 'created_at', order = 'desc') => {

    const queries = []
    const validSortColumns = ['title', 'topic', 'author', 'body', 'created_at']
    const validSortOrders = ['asc', 'desc']

    if(!validSortColumns.includes(sort_by) || !validSortOrders.includes(order)){
        return Promise.reject({status: 400, msg: 'Invalid sort query'})
    }

    let baseQuery = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count
                     FROM articles
                     LEFT JOIN comments ON articles.article_id = comments.article_id `

    if(topic){
        baseQuery += `WHERE topic = $1 `
        queries.push(topic)
    }

    baseQuery += `GROUP BY articles.article_id 
                  ORDER BY articles.${sort_by} ${order} `

    const { rows } = await db.query(baseQuery, queries)
    return rows
}

exports.updateArticle = async (id, { inc_votes }) => {
    if(inc_votes){
        const { rows } = await db.query(`
            UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *
            `, [inc_votes, id])
        return rows[0]
    } else {
        return Promise.reject({status: 400, msg: 'Invalid votes'})
    }

}