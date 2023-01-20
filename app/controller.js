const {fetchTopics, fetchArticles, fetchArticleById, fetchComments, changeArticleVotes} = require('./model.js')

const fs = require('fs/promises')

const getTopics = (request, response) => 
{
    fetchTopics()
    .then((rows) => 
    {
        response.status(200).send(rows)
    })
}

const getArticles = (request, response, next) =>
{
    fetchArticles().then((rows) =>
    {
        response.status(200).send(rows)
    })
    .catch(next)
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

const getComments = (request, response, next) =>
{
    const { params } = request
    fetchComments(params.article_id)
    .then((rows) =>
    {
      response.status(200).send(rows)
    })
    .catch(next)
}




































const patchArticleVotes = (request, response, next) =>
{
    const { params, body } = request

    changeArticleVotes(params.article_id, body)
    .then((rows) =>
    {
        response.status(200).send(rows[0])
    })
    .catch(next)
}

module.exports = { getTopics, getArticles, getArticleById, getComments, patchArticleVotes }