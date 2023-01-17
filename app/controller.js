const {fetchTopics, fetchArticles} = require('./model.js')
const fs = require('fs/promises')

const getTopics = (request, response) => 
{
    fetchTopics().then((rows) => 
    {
        response.status(200).send(rows)
    })
}

const getArticles = (request, response) =>
{
    fetchArticles().then(() =>
    {
        response.status(200).send()
    })
}

module.exports = { getTopics, getArticles }