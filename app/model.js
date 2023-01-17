const fs = require('fs/promises')
const format = require('pg-format')
const db = require('../db/connection')

fetchTopics = () =>
{
    return db.query('SELECT * FROM topics')
    .then((response) => 
    {
        return response.rows
    })
}

const fetchComments = (params) =>
{
    return db.query
    (
        `
        SELECT *
        FROM comments
        WHERE article_id = ${params};
        `
    )
    .then((response) =>
    {
        return response.rows
    })
}
module.exports = {fetchTopics, fetchComments}