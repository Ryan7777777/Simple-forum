const db = require('../config/db');
const errors = require('../services/errors');

exports.new_post = async function(title,content,id){
    const new_post_query = 'INSERT INTO Post (user, post_title, post_content, time_posted) VALUES (?, ?, ?, ?)';
    const newpost_data =[
        id,
        title,
        content,
        new Date()
    ];
    try{
        db.getPool().query(new_post_query,newpost_data)
    } catch(err){
        errors.logSqlError(err);
        throw err;
    }
};
exports.author_checker = async function (PostId,UserId) {
    const post_author_query = 'SELECT post_title FROM post WHERE post_id = ? and user = ?';
    try {
        const rows = await db.getPool().query(post_author_query,[PostId,UserId]);
        if (rows[0].title !== null) {
            return true
        } else {
            return false
        }
    } catch (err) {
        errors.logSqlError(err);
        return null;
    }
};
exports.edit_post = async function(PostId,title,content){
    const post_edit_query = "UPDATE Post Set post_title = ?,post_content = ?,time_posted = ? WHERE post_id = ?";
    try{
        db.getPool().query(post_edit_query,[title,content,new Date(),PostId]);

    } catch(err){
        errors.logSqlError(err);
        throw err;
    }
};