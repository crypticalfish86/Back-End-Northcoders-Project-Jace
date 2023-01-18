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

describe('APP be-nc-news', () =>
{
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
            .then((response) =>
            {
                const { body } = response
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
        test('responds with error 400 if URL specifies an ID that does not exist', () =>
        {
            return request(app).get('/api/articles/132958323').expect(400)
            .then((err) =>
            {
                expect(err.body.msg).toEqual('invalid article ID: ID not found')
            })
        })
    })
})

