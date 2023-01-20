const {fetchTopics, fetchArticles, fetchArticleById, fetchComments, removeComment} = require('./model.js')

const fs = require('fs/promises')
const { response } = require('./app.js')

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



















































const deleteComment = (request, response, next) =>
{
    const { params } = request
    console.log(params)
    removeComment()
    .then(() =>
    {
        response.status(204).send()
    })
    .catch(next)
}


module.exports = { getTopics, getArticles, getArticleById, getComments, deleteComment }