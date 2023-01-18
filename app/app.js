const express = require('express')
const {getTopics, getArticles} = require('./controller.js')
const app = express()

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);


module.exports = app;