const db = require('../config/db');
const errors = require('../services/errors');

exports.new_comment = async function(Userid,content,Postid){
    const newpost_sql = "INSERT INTO COMMENT(related_user, related_post, comment_content) VALUES (?, ? ,?)";
    const updatetime_sql = "UPDATE POST Set last_update = ? WHERE post_id = ?";
    try{
        await db.getPool().query(newpost_sql,[Userid,Postid,content]);
        await db.getPool().query(updatetime_sql,[new Date(),Postid]);
    } catch(err){
        errors.logSqlError(err);
        return null;
    }
}
exports.editcomment = async function(Userid,content,Postid){
    const editpost_sql = "UPDATE COMMENT Set comment_content = ? WHERE related_user = ? AND related_post = ?";
    try{
        const row = await db.getPool().query(editpost_sql,[content,Userid,Postid]);
        if (row.changedRows <= 0 && row.affectedRows == 0) {
            return null;
        } else if(row.changedRows <= 0){
            return false;
        } else{
            return true
    }
    } catch(error){
        errors.logSqlError(error);
        return null
    }
};
exports.deletecomment = async function(userId,postId){
    const delete_allcomment_query = "DELETE FROM Comment Where related_user = ? and related_post = ?";
    try {
        const row = await db.getPool().query(delete_allcomment_query, [userId, postId]);
        if (row.changedRows <= 0 && row.affectedRows == 0) {
            return null;
        } else if (row.changedRows <= 0) {
            return false;
        } else {
            return true
        }
    } catch(error){
        {
            errors.logSqlError(error);
            throw error;
        }
    }
};
