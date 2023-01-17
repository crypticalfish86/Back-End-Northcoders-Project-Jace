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
    describe('GET: /api/articles/:article_id/comments', () =>
    {
        test('GET status 200', () =>
        {
            return request(app).get('/api/articles/1/comments').expect(200)
        })
        test('Responds with an array of objects', () =>
        {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) =>
            {
                expect(Array.isArray(body)).toBe(true)
                body.forEach((element) =>
                {
                    expect(typeof element).toBe('object')
                    expect(Array.isArray(element)).toBe(false)> jest
                })
            })
        })
        test(`Responds with an array of objects that have the following properties: 
        comment_id, votes, created_at, author, body, article_id`, () =>
        {
            return request(app).get('/api/articles/1/comments').expect(200)
            .then(({ body }) =>
            {
                body.forEach((element) =>
                {
                    expect(element).toHaveProperty('comment_id')
                    expect(element).toHaveProperty('votes')
                    expect(element).toHaveProperty('created_at')
                    expect(element).toHaveProperty('author')
                    expect(element).toHaveProperty('body')
                    expect(element).toHaveProperty('article_id')
                })
            })
        })
    })
})