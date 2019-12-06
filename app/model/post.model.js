const db = require('../../config/db');
const errors = require('../services/errors');
exports.new_post = async function(title,content,id){
    const new_post_query = 'INSERT INTO Post (user, post_title, last_update) VALUES (?, ?, ?)';
    const newcomment_query = "INSERT INTO COMMENT(related_user, related_post, comment_content,lastupdate,top_comment) VALUES (?, ? ,?,?,?)";
    const newpost_data =[
        id,
        title,
        new Date()
    ];
    try{
        const rows = await db.getPool().query(new_post_query,newpost_data);
        await db.getPool().query(newcomment_query,[id,rows.insertId,content,new Date(),1]);
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
    const post_edit_query = "UPDATE Post Set post_title = ?,last_update = ? WHERE post_id = ?";
    const comment_edit_query = "UPDATE Comment Set comment_content = ?,lastupdate = ? WHERE related_post = ? AND top_comment = ?";
    console.log(PostId)
    try{
        db.getPool().query(post_edit_query,[title,new Date(),PostId]);
        db.getPool().query(comment_edit_query,[content,new Date(),PostId,1]);

    } catch(err){
        errors.logSqlError(err);
        throw err;
    }
};
exports.allpost = async function(){
    const get_all_query = "SELECT post_title, last_update, user_name FROM Post JOIN User ON user = user_id ORDER BY last_update DESC";
    try{
      const rows = await db.getPool().query(get_all_query);
      return rows.map(row => ({
            'title': row.post_title,
            'content': row.post_content,
            'date': row.last_update,
            'author': row.user_name
            }));
    } catch(err){
        errors.logSqlError(err);
        throw err;
    }
};
exports.deletepost = async function(postId){
    const delete_allcomment_query = "DELETE FROM Comment Where related_post = ?";
    const deletepost_query = "DELETE FROM Post WHERE post_id = ?";
    try{
        await db.getPool().query(delete_allcomment_query,[postId]);
        await db.getPool().query(deletepost_query,[postId]);
    } catch (err){
        errors.logSqlError(err);
        throw err;
    }
};
