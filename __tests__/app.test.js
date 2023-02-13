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