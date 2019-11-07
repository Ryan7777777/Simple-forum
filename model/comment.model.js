const db = require('../config/db');
const errors = require('../services/errors');

exports.new_comment = async function(Userid,content,Postid){
    const newpost_sql = "INSERT INTO Comment (related_user, related_post, comment_content) VALUES (?, ? ,?)";
    const updatetime_sql = "UPDATE POST Set last_update = ? WHERE post_id = ?";
    try{
        await db.getPool().query(newpost_sql,[Userid,Postid,content]);
        await db.getPool().query(updatetime_sql,[new Date(),Postid]);
    } catch(err){
        errors.logSqlError(err);
        return null;
    }

}