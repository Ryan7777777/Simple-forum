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