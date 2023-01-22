const express = require('express')
const app = express()
app.use(express.json())

const {getTopics, getArticles, getArticleById, getComments, postUserComment} = require('./controller.js')


app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getComments)





module.exports = app;



























 





















































app.post('/api/articles/:article_id/comments', postUserComment)

app.use((error, request, response, next) =>
{
    if(error.status && error.msg)
    {
        const {status, msg} = error
        response.status(status).send({msg: msg})
    }
})