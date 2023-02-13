const fs = require('fs/promises')
const format = require('pg-format')
const { query } = require('../db/connection')
const db = require('../db/connection')
const { response } = require('./app')

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
                `SELECT articles.*,
                COUNT(comments.article_id) ::INT
                AS comment_count
                FROM articles
                LEFT JOIN comments ON articles.article_id = comments.article_id
                WHERE articles.article_id = ${params}
                GROUP BY articles.article_id`
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

const changeArticleVotes = (article_id, body) =>
{
    if(!/[0-9]+/g.test(article_id))
    {
        return Promise.reject({status: 400, msg: 'invalid article ID: not a number'})
    }
    if(!/[0-9]+/g.test(body.inc_votes))
    {
        return Promise.reject({status: 400, msg: 'invalid vote input: not a number'})
    }
    return db.query
    (
        `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        `
        ,
        [body.inc_votes, article_id]
    )
    .then(() =>
    {
        return db.query
        (
            `
            SELECT *
            FROM articles
            WHERE article_id = $1
            `
            ,
            [article_id]
        )
    })
    .then((response) =>
    {
        if(response.rowCount !== 0)
        {
            return response.rows
        }
        else
        {
            return Promise.reject({status: 404, msg: 'invalid article ID: ID not found'})
        }
    })
}

const fetchUsers = () =>
{
    return db.query
    (
        `
        SELECT *
        FROM users
        `
    )
    .then((response) =>
    {
        return response.rows
    })
}

const removeComment = (comment_id) =>
{
    if(!/[0-9]+/g.test(comment_id))
    {
        return Promise.reject({status: 400, msg: 'invalid comment ID: not a number'})
    }
    return db.query
    (
        `
        DELETE FROM comments
        WHERE comment_id = ${comment_id}
        RETURNING *
        `
    )
    .then((response) =>
    {
        if(response.rowCount === 0)
        {
            return Promise.reject({status: 404, msg: 'invalid comment ID: ID not found'})
        }
        else
        {
            return response.rows
        }
    })
}

module.exports = {fetchTopics, fetchArticles, fetchArticleById, fetchComments,addUserComment, changeArticleVotes, fetchUsers, removeComment}