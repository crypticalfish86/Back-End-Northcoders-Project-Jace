const express = require('express')
const {getTopics, getComments} = require('./controller.js')
const app = express()

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id/comments', getComments)

app.use((error, request, response, next) =>
{
    if(error.status && error.msg)
    {
        const {status, msg} = error
        response.status(status).send({msg: msg})
    }
})
module.exports = app;