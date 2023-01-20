const express = require('express')
const app = express()
const {getTopics, getArticles, getArticleById, getComments} = require('./controller.js')
app.use(express.json())

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getComments)


















app.delete('/api/comments/:comment_id')


app.use((error, request, response, next) =>
{
    if(error.status && error.msg)
    {
        const {status, msg} = error
        response.status(status).send({msg: msg})
    }
})

module.exports = app;