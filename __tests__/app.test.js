const app = require('../app/app.js')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const db = require('../db/connection')
beforeEach(() => 
{
    return seed(testData)
})

afterAll(() =>
{
    db.end()
})

describe('GET /api', () =>
{
    test('GET: will return a json file detailing all the endpoints in this api', () =>
    {
        return request(app).get('/api').expect(200)
        .then(({ body }) =>
        {
            expect(typeof body).toBe('object')
            expect(body).toHaveProperty('GET /api', expect.any(Object))
            expect(body).toHaveProperty('GET /api/topics', expect.any(Object))
            expect(body).toHaveProperty('GET /api/articles', expect.any(Object))
            expect(body).toHaveProperty('GET /api/articles/:article_id', expect.any(Object))
            expect(body).toHaveProperty('GET /api/articles/:article_id/comments', expect.any(Object))
            expect(body).toHaveProperty('POST /api/articles/:article_id/comments', expect.any(Object))
            expect(body).toHaveProperty('PATCH /api/articles/:article_id', expect.any(Object))
            expect(body).toHaveProperty('GET /api/users', expect.any(Object))
            expect(body).toHaveProperty('DELETE /api/comments/:comment_id', expect.any(Object))
        })
    })
})

describe('GET /api/topics', () => 
{
    test('GET: will return status 200', () => 
    {
        return request(app).get('/api/topics').expect(200)
    })
    test('responds with an array of objects', () => 
    {
        return request(app).get('/api/topics').expect(200)
        .then((response) => 
        {
            const { body } = response
            expect(Array.isArray(body)).toBe(true)
            expect(body.length !== 0).toBe(true)
            body.forEach((element) =>
            {
                expect(typeof element).toBe('object')
                expect(Array.isArray(element)).toBe(false)
            })
        })
    })
    test('response with an array of objects which each have a slug and description property', () => 
    {
        return request(app).get('/api/topics').expect(200)
        .then(({ body }) =>
        {
            body.forEach((element) =>
            {
                expect(element).toHaveProperty('slug')
                expect(element).toHaveProperty('description')
            })
        })
    })
    
})

describe('GET /api/articles/:article_id', () =>
{
    test('responds with an object that isn\'t empty', () =>
    {
        return request(app).get('/api/articles/1').expect(200)
        .then(({ body }) =>
        {
            expect(Array.isArray(body)).toBe(false)
            expect(typeof body).toBe('object')
            expect(Object.keys(body).length !== 0).toBe(true)
        })
    })
    test(`response is an object with the object keys: author, title
    article_id, body, topic, created_at, votes, article_img_url`, () =>
    {
        return request(app).get('/api/articles/1').expect(200)
        .then(({ body }) =>
        {
            expect(body).toHaveProperty('author', expect.any(String))
            expect(body).toHaveProperty('title', expect.any(String))
            expect(body).toHaveProperty('article_id', expect.any(Number))
            expect(body).toHaveProperty('body', expect.any(String))
            expect(body).toHaveProperty('topic', expect.any(String))
            expect(body).toHaveProperty('created_at', expect.any(String))
            expect(body).toHaveProperty('votes', expect.any(Number))
            expect(body).toHaveProperty('article_img_url', expect.any(String))
            expect(body).toHaveProperty('comment_count', expect.any(Number))
        })
    })
    test(`response is an object with the object keys: author, title
    article_id, body, topic, created_at, votes, article_img_url
    where the relevent article_id is present`, () =>
    {
        return request(app).get('/api/articles/1').expect(200)
        .then(({ body }) =>
        {
            expect(body).toHaveProperty('author')
            expect(body).toHaveProperty('title')
            expect(body).toHaveProperty('article_id')
            expect(body).toHaveProperty('body')
            expect(body).toHaveProperty('topic')
            expect(body).toHaveProperty('created_at')
            expect(body).toHaveProperty('votes')
            expect(body.article_id).toEqual(1)
            expect(body.comment_count).toEqual(11)
        })
    })
    test('responds with error 400 if anything except a number is requested as a parameter', () =>
    {
        return request(app).get('/api/articles/test').expect(400)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('invalid article ID: not a number')
        })
    })
    test('responds with error 404 if URL specifies an ID that does not exist', () =>
    {
        return request(app).get('/api/articles/132958323').expect(404)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('invalid article ID: ID not found')
        })
    })
})

describe('GET /api/articles', () =>
{
    test('GET Will respond with an array of objects', () =>
    {
        return request(app).get('/api/articles').expect(200)
        .then(({body}) => 
        {
            expect(Array.isArray(body)).toBe(true)
            expect(body.length !== 0).toBe(true)
            body.forEach((element) => 
            {
                expect(Array.isArray(element)).toBe(false)
                expect(typeof element).toBe('object')
            })
        })
    })
    test(`GET will respond with an array of objects each object having the properties, 
    author, title, article_id, topic, created_at, votes, article_img_url, comment_count
    and does NOT have the body property`, () =>
    {
        return request(app).get('/api/articles').expect(200)
        .then(({body}) =>
        {
            body.forEach((element) =>
            {
                expect(element).toHaveProperty('author')
                expect(element).toHaveProperty('title')
                expect(element).toHaveProperty('article_id')
                expect(element).toHaveProperty('topic')
                expect(element).toHaveProperty('created_at')
                expect(element).toHaveProperty('votes')
                expect(element).toHaveProperty('article_img_url')
                expect(element).toHaveProperty('comment_count')
                expect(element.body).toEqual(undefined)
            })
        })
    })
    test('has sorted the objects in the array by the created_at property', () =>
    {
        return request(app).get('/api/articles').expect(200)
        .then(({body}) =>
        {
            expect(body).toBeSortedBy('created_at', {ascending: true})
        })
    })
    test('GET will respond with an array of objects only with the relevant topic if specified in the query', () =>
    {
        return request(app).get('/api/articles?topic=mitch').expect(200)
        .then(({ body }) =>
        {
            body.forEach((element) =>
            {
                expect(element.topic).toEqual('mitch')
            })
        })
    })
    test('GET will respond with an array of objects sorted by comment_count if specified in the query', () =>
    {
        return request(app).get('/api/articles?sort_by=comment_count').expect(200)
        .then(({ body }) =>
        {
            expect(body).toBeSortedBy('comment_count', {ascending: true})
        })
    })
    test('GET will respond with an array of objects sorted by comment_count in descending order if specified in the query', () =>
    {
        return request(app).get('/api/articles?sort_by=comment_count&order=DESC').expect(200)
        .then(({ body }) =>
        {
            expect(body).toBeSortedBy('comment_count', {descending: true})
        })
    })
    test('final query test to ensure all 3 queries are working together fine', () =>
    {
        return request(app).get('/api/articles?topic=mitch&sort_by=comment_count&order=DESC').expect(200)
        .then(({ body }) =>
        {
            body.forEach((element) =>
            {
                expect(element.topic).toEqual('mitch')
            })
            expect(body).toBeSortedBy('comment_count', {descending: true})
        })
    })
    test('if the sort_by query includes anything not on the whitelist, returns a status 400 and error', () =>
    {
        return request(app).get('/api/articles?sort_by=test').expect(400)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('Invalid Sort Term')
        })
    })
    test('if the order query includes anything not on the whitelist, returns a status 400 and error', () =>
    {
        return request(app).get('/api/articles?order=test').expect(400)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('Invalid Order Term')
        })
    })
})



describe('GET: /api/articles/:article_id/comments', () =>
    {
        test('Responds with an array of objects', () =>
        {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) =>
            {
                expect(Array.isArray(body)).toBe(true)
                body.forEach((element) =>
                {
                    expect(typeof element).toBe('object')
                    expect(Array.isArray(element)).toBe(false)
                })
            })
        })
        test(`Responds with an array of objects that have the following properties: 
        comment_id(number), votes(string), created_at(string), author(string), body(string), article_id(number)`, () =>
        {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) =>
            {
                expect(body.length !== 0).toBe(true)
                body.forEach((element) =>
                {
                    expect(element).toEqual
                    (
                        expect.objectContaining
                        (
                            {
                                comment_id: expect.any(Number),
                                body: expect.any(String),
                                article_id: expect.any(Number),
                                author: expect.any(String),
                                votes: expect.any(Number),
                                created_at: expect.any(String)
                            }
                        )
                    )
                })
            })
        })
        test('responds with the correct comments of the relevant article', () =>
        {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) =>
            {
                expect(body.length !== 0).toBe(true)
                body.forEach((element) =>
                {
                    expect(element.article_id).toEqual(1)
                })
            })
        })
        test('if the article has 0 comments then it should respond with an empty array and a status code of 200', () =>
        {
            return request(app).get('/api/articles/12/comments').expect(200)
            .then(({ body }) =>
            {
                expect(Array.isArray(body)).toBe(true)
                expect(body.length).toBe(0)
            })
        })
        test('responds with a status of 400 and a message: invalid article ID: not a number when given an id that isn\'t a number', () =>
        {
            return request(app).get('/api/articles/test/comments').expect(400)
            .then((err) =>
            {
                expect(err.body.msg).toEqual('invalid article ID: not a number')
            })
        })
        test('responds with a status of 404 and a message invalid article ID: ID not found, when given a number out of range of our database', () =>
        {
            return request(app).get('/api/articles/10298748/comments').expect(404)
            .then((err) =>
            {
                expect(err.body.msg).toEqual('invalid article ID: ID not found')
            })
        })
    })

describe('POST /api/articles/:article_id/comments', () =>
    {
        test('takes an object containing a username and a body in the request body and returns an object', () =>
        {
            const userCommentReference = 
            {
                username: 'icellusedkars',
                body: 'new comment test'
            }
            return request(app).post('/api/articles/1/comments').expect(201).send(userCommentReference)
            .then(({ body }) =>
            {
                expect(Array.isArray(body)).toBe(false)
                expect(typeof body).toBe('object')
            })
        })
        test(`the returned object contains the properties comment_id(number), body(string), article_id(number),
        author(string), votes(number), created_at(string)`, () =>
        {
            const userCommentReference = 
            {
                username: 'icellusedkars',
                body: 'new comment test'
            }
            return request(app).post('/api/articles/1/comments').expect(201).send(userCommentReference)
            .then(({ body }) =>
            {
                expect(body).toEqual
                (
                    expect.objectContaining(
                        {
                            comment_id: expect.any(Number),
                            body: expect.any(String),
                            article_id: expect.any(Number),
                            author: expect.any(String),
                            votes: expect.any(Number),
                            created_at: expect.any(String)
                        }
                    )
                )
            })
        })
        test(`returns the correct body, article_id and author`, () =>
        {
            const userCommentReference = 
            {
                username: 'icellusedkars',
                body: 'new comment test'
            }
            return request(app).post('/api/articles/1/comments').expect(201).send(userCommentReference)
            .then(({ body }) =>
            {
                expect(body.author).toEqual(userCommentReference.username)
                expect(body.body).toEqual(userCommentReference.body)
                expect(body.article_id).toEqual(1)
            })
        })
        test(`ignores extra information on the request body`, () =>
        {
            const userCommentReference = 
            {
                username: 'icellusedkars',
                body: 'new comment test',
                extra_info: 'test'
            }
            return request(app).post('/api/articles/1/comments').expect(201).send(userCommentReference)
            .then(({ body }) =>
            {
                expect(body.author).toEqual(userCommentReference.username)
                expect(body.body).toEqual(userCommentReference.body)
                expect(body.article_id).toEqual(1)
                expect(body.extra_info).toEqual(undefined)
            })
        })
        test('if article id given is not a number, return status 400 and error message', () =>
        {
            const userCommentReference = 
            {
                username: 'icellusedkars',
                body: 'new comment test'
            }
            return request(app).post('/api/articles/test/comments').expect(400).send(userCommentReference)
            .then((err) =>
            {
                expect(err.body.msg).toEqual('invalid article ID: not a number')
            })
        })
        test('if trying to add a comment to an article id that does not exist then return status 404 and error message', () =>
        {
            const userCommentReference = 
            {
                username: 'icellusedkars',
                body: 'new comment test'
            }
            return request(app).post('/api/articles/12098376/comments').expect(404).send(userCommentReference)
            .then((err) =>
            {
                expect(err.body.msg).toEqual('invalid article ID: article not found')
            })
        })
        test('if username or body is missing returns status 400 and error message', () =>
        {
            const userCommentReference = 
            {
                username: 'icellusedkars',
            }
            return request(app).post('/api/articles/12098376/comments').expect(400).send(userCommentReference)
            .then((err) =>
            {
                expect(err.body.msg).toEqual('Username or Body missing')
            })
        })
        test('if username is not valid returns status 404 and error message', () =>
        {
            const userCommentReference = 
            {
                username: 'this_user_does_not_exist',
                body: 'new comment test'
            }
            return request(app).post('/api/articles/12098376/comments').expect(404).send(userCommentReference)
            .then((err) =>
            {
                expect(err.body.msg).toEqual('invalid Username: User not found')
            })
        })
    })
    
describe('PATCH /api/articles/:article_id', () => 
{
    test('responds with a 200 request when a patch is sucessful and responds with an object', () =>
    {
        const voteChange = {inc_votes : 2}
        return request(app).patch('/api/articles/1').expect(200).send(voteChange)
        .then(({ body }) =>
        {
            expect(Array.isArray(body)).toBe(false)
            expect(typeof body).toBe('object')
        })
    })
    test('responds with an article from the article database (tested by checking the properties)', () =>
    {
        const voteChange = {inc_votes : 2}
        return request(app).patch('/api/articles/1').expect(200).send(voteChange)
        .then(({ body }) =>
        {
            expect(body).toEqual
            (
                expect.objectContaining
                (
                    {
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String)
                    }
                )
            )
        })

    })
    test('responds with the correct article with the updated votes total and can add votes', () =>
    {
        const voteChange = {inc_votes : 2}
        return request(app).patch('/api/articles/1').expect(200).send(voteChange)
        .then(({ body }) =>
        {
            expect(body.article_id).toEqual(1)
            expect(body.votes).toEqual(102)
        })
    })
    test('responds with the correct article with the updated votes total and can subtract votes', () =>
    {
        const voteChange = {inc_votes : -2}
        return request(app).patch('/api/articles/1').expect(200).send(voteChange)
        .then(({ body }) =>
        {
            expect(body.article_id).toEqual(1)
            expect(body.votes).toEqual(98)
        })
    })
    test('responds with an error 400 if article_id is anything except a number', () =>
    {
        const voteChange = {inc_votes : 2}
        return request(app).patch('/api/articles/test').expect(400).send(voteChange)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('invalid article ID: not a number')
        })
    })
    test('responds with an error 400 if the request body is anything but a number', () =>
    {
        const voteChange = {inc_votes : 'test'}
        return request(app).patch('/api/articles/1').expect(400).send(voteChange)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('invalid vote input: not a number')
        })
    })
    test('responds with an error 404 if the article id requested is out of range of the database', () =>
    {
        const voteChange = {inc_votes : 2}
        return request(app).patch('/api/articles/987634').expect(404).send(voteChange)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('invalid article ID: ID not found')
        })
    })
})

describe('GET /api/users', () =>
{
    test(`responds with an array of objects that each have the properties username(string),
    name(string) and avatar_url(string)`, () =>
    {
        return request(app).get('/api/users').expect(200)
        .then(({ body }) =>
        {
            body.forEach((element) =>
            {
                expect(element).toEqual
                (
                    expect.objectContaining
                    (
                        {
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        }
                    )
                )
    
            })
        })
    })
})

    describe('DELETE /api/comments/:comment_id', () =>
    {
        test('if the delete is successful, should return a status 204 and the comment should not longer exist in the database', () =>
        {
            return request(app).delete('/api/comments/2').expect(204)
            .then(() =>
            {
                db.query(`SELECT * FROM comments WHERE comment_id = 2`)
                .then((response) =>
                {
                    expect(response.rowCount).toEqual(0)
                })
            })
        })
        test('returns a status 400 and error if comment_id is anything but a number', () =>
        {
            return request(app).delete('/api/comments/test').expect(400)
            .then((err) =>
            {
                expect(err.body.msg).toEqual('invalid comment ID: not a number')
            })
        })
        test('returns a status 404 and error if comment_id is out of range of database', () =>
        {
            return request(app).delete('/api/comments/12378649886').expect(404)
            .then((err) =>
            {
                expect(err.body.msg).toEqual('invalid comment ID: ID not found')
            })
        })
    })
