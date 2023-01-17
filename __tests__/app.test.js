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
        test('GET: will return a status of 200', () => 
        {
            return request(app).get('/api/articles').expect(200)
        })
        test('Will respond with an array of objects', () =>
        {
            return request(app).get('/api/articles').expect(200)
            .then(({body}) => 
            {
                expect(Array.isArray(body)).toBe(true)
                body.forEach((element) => 
                {
                    expect(Array.isArray(element)).toBe(false)
                    expect(typeof element).toBe('object')
                })
            })
        })
        test(`will respond with an array of objects each object having the properties, 
        author, title, article_id, topic, created_at, votes, article_img_url, comment_count`, () =>
        {
            
        })
    })
})