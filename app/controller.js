const {fetchTopics, fetchArticles, fetchArticleById, fetchComments,addUserComment, changeArticleVotes, fetchUsers, removeComment} = require('./model.js')

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
    const { topic, sort_by, order} = request.query
    fetchArticles(topic, sort_by, order).then((rows) =>
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

const postUserComment = (request, response, next) =>
{
    const { params, body } = request
    addUserComment(params.article_id, body)
    .then(({rows}) =>
    {
        response.status(201).send(rows[0])
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

const getUsers = (request, response, next) =>
{
    fetchUsers()
    .then((rows) =>
    {
        response.status(200).send(rows)
    })
}

const deleteComment = (request, response, next) =>
{
    const { params } = request
    removeComment(params.comment_id)
    .then((rows) =>
    {
        response.status(204).send(rows[0])
    })
    .catch(next)
}

module.exports = { getTopics, getArticles, getArticleById, getComments, postUserComment, patchArticleVotes, getUsers, deleteComment }