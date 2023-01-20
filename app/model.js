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

const fetchArticles = (query) =>
{
    console.log(query)
    if(!query.hasOwnProperty('topic'))
    {
        query.topic = ''
    }
    else
    {
        query.topic = 'WHERE topic' + ' = ' + '\''+ query.topic + '\''
    }
    if(!query.hasOwnProperty('sort_by'))
    {
        query.sort_by = 'articles.created_at'
    }
    if(!query.hasOwnProperty('order'))
    {
        query.order = 'ASC'
    }
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
        $1
        GROUP BY articles.article_id
        ORDER BY $2 $3
        `
        ,
        [query.topic, query.sort_by, query.order]
    )//i've spent hours on this, for some reason it doesn't work
    .then((response) =>
    {
        console.log(response.rows)
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

