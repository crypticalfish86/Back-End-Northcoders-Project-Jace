const {fetchTopics, fetchArticleById} = require('./model.js')
const fs = require('fs/promises')

const getTopics = (request, response) => 
{
    fetchTopics().then((rows) => 
    {
        response.status(200).send(rows)
    })
}

const getArticleById = (request, response, next) =>
{
    const { params } = request
    fetchArticleById(params.article_id)
    .then(({ rows }) =>
    {
        response.status(200).send(rows[0])
    })
    .catch(next)
}

module.exports = { getTopics, getArticleById }