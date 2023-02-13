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