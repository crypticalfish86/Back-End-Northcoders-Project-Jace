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

module.exports = {fetchTopics}