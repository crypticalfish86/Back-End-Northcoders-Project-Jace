const fs = require('fs/promises')
const format = require('pg-format')
const db = require('../db/connection')

const fetchTopics = () =>
{
    return db.query('SELECT * FROM topics')
    .then((response) => 
    {
        return response.rows
    })
}

const fetchArticles = () =>
{
    return db.query
    (
        `
        SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at,
        articles.votes, articles.article_img_url,
        (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id)
        AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.comment_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at ASC
        `
    )
    .then((response) =>
    {
        if(response.rows.body !== undefined)
        {
            return Promise.reject({status: 401, msg: 'body should not be included'})
        }
        else
        {
            return response.rows
        }
    })
}

module.exports = {fetchTopics, fetchArticles}