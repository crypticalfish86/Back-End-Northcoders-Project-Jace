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


















































































































const addUserComment = (params, body) =>
{
    if(!/[0-9]+/g.test(params))
    {
        return Promise.reject({status: 400, msg: 'invalid article ID: not a number'})
    }
    if(body.body === undefined || body.username === undefined)
    {
        return Promise.reject({status: 400, msg: 'Username or Body missing'})
    }
    return db.query
    (
        `
        SELECT *
        FROM users
        WHERE username = $1
        `
        , [body.username]
    )
    .then((response)=>
    {
        if(response.rowCount === 0)
        {
            return Promise.reject({status: 404, msg: 'invalid Username: User not found'})
        }
        return db.query
    (
        `
        SELECT *
        FROM articles
        WHERE article_id = ${params}
        `
    )
    .then((response) =>
    {
        
        if(response.rowCount === 0)
        {
            return Promise.reject({status: 404, msg: 'invalid article ID: article not found'})
        }
        else
        {
            
            const SQLStringInsert = format
            (
                `
                INSERT INTO comments (body, author, article_id)
                VALUES %L
                Returning *;
                `
                ,[[body.body, body.username, params]]
            )

            return db.query(SQLStringInsert)
            .then(() =>
            {
                return db.query
                (
                    `
                    SELECT *
                    FROM comments
                    WHERE body = $1
                    AND author = $2
                    AND article_id = $3
                    `
                    ,
                    [body.body, body.username, params]
                )
            })
        }
    })
    })
}

module.exports = {fetchTopics, fetchArticles, fetchArticleById, fetchComments, addUserComment}