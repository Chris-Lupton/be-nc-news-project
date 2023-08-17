const format = require('pg-format')
const db = require('../db/connection')

exports.checkExists = async (table, column, value) => {
  const queryString = format('SELECT * FROM %I WHERE %I = $1;', table, column)
  const { rows } = await db.query(queryString, [value])

  if (!rows.length) {
    if(column === 'username'){
      return Promise.reject({ status: 404, msg: 'User not found' })
    } else {
      return Promise.reject({ status: 404, msg: 'Resource not found' })
    }
  }
}