const {fetchTopics, fetchComments} = require('./model.js')
const fs = require('fs/promises')

const getTopics = (request, response) => 
{
    fetchTopics()
    .then((rows) => 
    {
        response.status(200).send(rows)
    })
}

const getComments = (request, response) =>
{
    const { params } = request
    fetchComments(params.article_id)
    .then((rows) =>
    {
        response.status(200).send(rows)
    })
}
module.exports = { getTopics, getComments }