const db = require('../../config/db');
const errors = require('../services/errors');

exports.getPostPhotoLink = async function(postId){
    const getpostphoto = 'SELECT file_name FROM post_photos WHERE related_post = ? ORDER BY uploadtime ASC';
    try{
        const photoslink = await db.getPool().query(getpostphoto,postId);
        return photoslink.map(photolink => ({
            photoFilename: photolink.file_name,
        }));
    } catch (err) {
        errors.logSqlError(err);
        throw err;
    }
};
exports.deletephoto = async function(postId, photoFilename){
    const getdeletephoto = 'DELETE FROM post_photos WHERE related_post = ? AND file_name = ?';
    try{
        const photoslink = await db.getPool().query(getdeletephoto,[postId,photoFilename]);
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
exports.addPostPhotoLink = async function(postId, photoFilename){
    const insertquery= 'INSERT INTO post_photos (file_name, related_post, uploadtime) VALUES (?, ?, ?)';
    try{
        const row = await db.getPool().query(insertquery,[photoFilename,postId,new Date()]);
    } catch(err){
        errors.logSqlError(err);
        throw err;
    }
};