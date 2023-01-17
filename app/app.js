const express = require('express')
const {getTopics, getArticles} = require('./controller.js')
const app = express()
app.use(express.json())
app.use((err, request, response, next) => 
{
    console.log(err)
    response.status(err.status).send(err.msg)
})
app.use((err, request, response, next) =>
{
    if(err)
    {
        response.status(500).send({err})
    }
})

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);


module.exports = app;