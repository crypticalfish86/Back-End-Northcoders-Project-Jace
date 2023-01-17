const fs = require('fs/promises')
const format = require('pg-format')
const db = require('../db/connection')

const fetchTopics = () =>
{
    return db.query('SELECT * FROM topics')
    .then((response) => 
    {
        return response.rows
    })
}

const fetchArticles = () =>
{
    return Promise.resolve()
}

module.exports = {fetchTopics, fetchArticles}