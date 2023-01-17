const express = require('express')
const {getTopics, getArticleById} = require('./controller.js')
const app = express()
app.use(express.json())


app.get('/api/topics', getTopics);



app.get('/api/articles/:article_id', getArticleById)

app.use((error, request, response, next) =>
{
    if(error.status && error.msg)
    {
        const {status, msg} = error
        response.status(status).send({msg: msg})
    }
})
module.exports = app;