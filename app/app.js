const express = require('express')
const app = express()
const cors=require('cors')
const {getEndpoints, getTopics, getArticles, getArticleById, getComments, postUserComment, patchArticleVotes, getUsers, deleteComment} = require('./controller.js')
app.use(cors())
app.use(express.json())

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', postUserComment)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.get('/api/users', getUsers)

app.delete('/api/comments/:comment_id', deleteComment)


app.use((error, request, response, next) =>
{
    if(error.status && error.msg)
    {
        const {status, msg} = error
        response.status(status).send({msg: msg})
    }
})
module.exports = app;
