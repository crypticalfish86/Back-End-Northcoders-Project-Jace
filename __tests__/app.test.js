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
    test('responds with error 400 if anything except a number is request as a parameter', () =>
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