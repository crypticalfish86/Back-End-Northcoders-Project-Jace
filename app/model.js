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
    if(/[0-9]+/g.test(params))
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
            if(response.rowCount !== 0)
            {
                return response.rows
            }
            else
            {
                return Promise.reject({status: 404, msg: 'invalid article ID: ID not found'})
            }
        })
    }
    else
    {
        return Promise.reject({status: 400, msg: 'invalid article ID: not a number'})
    }
    
}
module.exports = {fetchTopics, fetchComments}