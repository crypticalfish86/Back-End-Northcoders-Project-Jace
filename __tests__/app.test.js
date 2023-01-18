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
})