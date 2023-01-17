const express = require('express')
const {getTopics, getComments} = require('./controller.js')
const app = express()
app.use(express.json())
app.use((error, request, response, next) =>
{
    if(error)
    {
        response.status(500).send({error})
    }
})

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id/comments', getComments)
module.exports = app;