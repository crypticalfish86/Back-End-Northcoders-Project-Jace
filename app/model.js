const fs = require('fs/promises')
const format = require('pg-format')
const { query } = require('../db/connection')
const db = require('../db/connection')

const fetchTopics = () =>
{
    return db.query('SELECT * FROM topics')
    .then((response) => 
    {
        return response.rows
    })
}


const fetchComments = (params) =>
{
    if(/[0-9]+/g.test(params))
    {
        return db.query
        (
            `
            SELECT *
            FROM comments
            WHERE article_id = ${params};
            `
        )
        .then((responseComment) =>
        {
            if(responseComment.rowCount !== 0)
            {
                return responseComment.rows
            }
            else
            {
                return db.query
                (
                    `
                    SELECT *
                    FROM articles
                    WHERE article_id = ${params}
                    `
                )
                .then((responseArticle) =>
                {
                    if(responseArticle.rowCount !== 0)
                    {
                        return responseComment.rows
                    }
                    else
                    {
                        return Promise.reject({status: 404, msg: 'invalid article ID: ID not found'})
                    }
                })
            }
        })
    }
    else
    {
        return Promise.reject({status:400, msg: 'invalid article ID: not a number'})
    }
}

const fetchArticles = (topic, sort_by, order) =>
{
    let sortByWhitelist =
    [
        'article_id',
        'title',
        'author',
        'created_at',
        'article_img_url',
        'comment_count',
        'votes',
        undefined
    ]
    let orderByWhitelist = ['ASC', 'DESC', undefined]
    
    const queryValues = []
    let queryStr = 
    `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at,
        articles.votes, articles.article_img_url,
        (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id)::INT
        AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.comment_id
    `
    if(topic)
    {
        queryValues.push(topic)
        queryStr += 'WHERE topic = $1'
    }
    if(!sort_by)
    {
       sort_by = 'created_at' 
    }
    if(!order)
    {
        order = 'ASC'
    }
    if(!sortByWhitelist.includes(sort_by))
    {
        return Promise.reject({status: 400, msg: 'Invalid Sort Term'})
    }
    if(!orderByWhitelist.includes(order))
    {
        return Promise.reject({status: 400, msg: 'Invalid Order Term'})
    }
    return db.query
    (
        `
        ${queryStr}
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order}
        `
        ,
        queryValues
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

const fetchArticleById = (params) =>
{
    if(/[0-9]+/g.test(params))
    {
        {
            return db.query
            (
                `SELECT *
                FROM articles
                WHERE article_id = ${params}`
            )
            .then((response) =>
            {
                if(response.rowCount !== 0)
                {
                    return response
                }
                else
                {
                    return Promise.reject({status: 404, msg: 'invalid article ID: ID not found'})
                }
            })
        }
    }
    else
    {
        return Promise.reject({status: 400, msg: 'invalid article ID: not a number'})
    }
}


module.exports = {fetchTopics, fetchArticles, fetchArticleById, fetchComments}

