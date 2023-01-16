const express = require('express')
const {getTopics} = require('./controller.js')
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

app.listen(9550, () => {console.log('listening on port 9550')})

module.exports = app;