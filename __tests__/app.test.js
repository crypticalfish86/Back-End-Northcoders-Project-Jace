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
            expect(body).toHaveProperty('author')
            expect(body).toHaveProperty('title')
            expect(body).toHaveProperty('article_id')
            expect(body).toHaveProperty('body')
            expect(body).toHaveProperty('topic')
            expect(body).toHaveProperty('created_at')
            expect(body).toHaveProperty('votes')
            expect(body).toHaveProperty('article_img_url')
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
})














































describe('POST /api/articles/:article_id/comments', () =>
{
    test('takes an object containing a username and a body in the request body and returns an object', () =>
    {
        let userCommentReference = 
            {
                username: 'icellusedkars',
                body: 'Fruit pastilles'
            }
        return request(app).post('/api/articles/1/comments').expect(200).send(userCommentReference)
        .then(({ body }) =>
        {
            expect(typeof body).toBe('object')
            expect(Array.isArray(body)).toBe(false)
        })
    })
    test(`takes an object containing a username and a body in the request body and returns an object that has the properties:
    body, votes, author, article_id, created_at`, () =>
    {
        let userCommentReference = 
            {
                username: 'icellusedkars',
                body: 'Fruit pastilles'
            }
        return request(app).post('/api/articles/1/comments').expect(200).send(userCommentReference)
        .then(({ body }) =>
        {
            expect(body).toHaveProperty('body')
            expect(body).toHaveProperty('votes')
            expect(body).toHaveProperty('author')
            expect(body).toHaveProperty('article_id')
            expect(body).toHaveProperty('created_at')
        })
    })
    test(`takes an object containing a username and a body in the request body and returns an object that 
    has the same body, same username as author, and the correct article_id`, () =>
    {
        let userCommentReference = 
        {
            username: 'icellusedkars',
            body: 'Fruit pastilles'
        }
        return request(app).post('/api/articles/1/comments').expect(200).send(userCommentReference)
        .then(({ body }) =>
        {
            expect(body.body).toEqual(userCommentReference.body)
            expect(body.author).toEqual(userCommentReference.username)
            expect(body.article_id).toEqual(1)
        })
    })
    test('responds with error 400 if anything except a number is requested as a parameter', () =>
    {
        let userCommentReference = 
        {
            username: 'icellusedkars',
            body: 'Fruit pastilles'
        }
        return request(app).post('/api/articles/test/comments').expect(400).send(userCommentReference)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('invalid article ID: not a number')
        })
    })
    test('responds with error 404 if URL specifies an ID that does not exist', () =>
    {
        let userCommentReference = 
        {
            username: 'icellusedkars',
            body: 'Fruit pastilles'
        }
        return request(app).post('/api/articles/102738619863/comments').expect(404).send(userCommentReference)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('invalid article ID: ID not found')
        })
    })
    test('if the username that is not matched anywhere, will return an error 404', () =>
    {
        let userCommentReference = 
        {
            username: 'THIS_USER_DOES_NOT_EXIST',
            body: 'Fruit pastilles'
        }
        return request(app).post('/api/articles/1/comments').expect(404).send(userCommentReference)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('invalid username: user not found')
        })
    })
    test('if the username is matched but the reference body is not matched anywhere, will return an error 404', () =>
    {
        let userCommentReference = 
        {
            username: 'icellusedkars',
            body: 'THIS BODY DOES NOT EXIST I DID NOT MAKE THIS COMMENT'
        }
        return request(app).post('/api/articles/1/comments').expect(404).send(userCommentReference)
        .then((err) =>
        {
            expect(err.body.msg).toEqual('invalid body: comment by that user not found')
        })
    })
})