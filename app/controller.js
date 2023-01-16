const {fetchTopics} = require('./model.js')
const fs = require('fs/promises')

const getTopics = (request, response) => 
{
    fetchTopics().then((rows) => 
    {
        response.status(200).send(rows)
    })
}

module.exports = { getTopics }