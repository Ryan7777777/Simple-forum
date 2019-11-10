const db = require('../config/db');
const errors = require('../services/errors');

exports.getCommnetPhotoLink = async function(commentId){
    const getcommentphoto = 'SELECT file_name FROM comment_photos WHERE related_comment = ? ORDER BY uploadtime ASC';
    try{
        const photoslink = await db.getPool().query(getcommentphoto,commentId);
        return photoslink.map(photolink => ({
            photoFilename: photolink.file_name,
        }));
    } catch (err) {
        errors.logSqlError(err);
        throw err;
    }
};
exports.deletephoto = async function(commentId, photoFilename){
    const getdeletephoto = 'DELETE FROM comment_photos WHERE related_comment = ? AND file_name = ?';
    try{
        const photoslink = await db.getPool().query(getdeletephoto,[commentId,photoFilename]);
        if(photoslink.affectedRows > 0) {
            return true
        }
        else{
            return null
        }
    }catch (err) {
        errors.logSqlError(err);
        throw err;
    }
};
exports.addCommentPhotoLink = async function(commentId, photoFilename){
    const insertquery= 'INSERT INTO comment_photos (file_name, related_comment, uploadtime) VALUES (?, ?, ?)';
    try{
        await db.getPool().query(insertquery,[photoFilename,commentId,new Date()]);
    } catch(err){
        errors.logSqlError(err);
        throw err;
    }
};