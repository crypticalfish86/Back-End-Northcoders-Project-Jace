const express = require('express')
const app = express()
const {getTopics, getArticles, getArticleById, getComments, getUsers} = require('./controller.js')

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getComments)






app.get('/api/users', getUsers)
app.use((error, request, response, next) =>
{
    if(error.status && error.msg)
    {
        const {status, msg} = error
        response.status(status).send({msg: msg})
    }
})

module.exports = app;