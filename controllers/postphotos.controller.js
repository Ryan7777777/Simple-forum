const Post = require('../model/post.model');
const Photos =require("../model/photos.models");
const tools = require('../services/tools');
const PostPhoto =require('../model/postphoto.model');

exports.getPostPhotos = async function (req,res){
    const postId = req.params.id;
    const photoFilename = req.params.filename;
    try{
        const Photoslink = await PostPhoto.getPostPhotoLink(postId);
        if (Photoslink.find(link => link.photoFilename === photoFilename)) {
            const imageDetails = await Photos.getPhoto(photoFilename);
            res.statusMessage = 'OK';
            res.status(200)
                .contentType(imageDetails.mimeType)
                .send(imageDetails.image);
        }
        else {
            res.statusMessage = 'Not Found';
            res.status(404)
                .send();
        }
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal Server Error';
        res.status(500)
            .send();
    }
};
exports.deletePostPhoto = async function (req, res) {
    const posrId  = req.params.id;
    const photoFilename = req.params.filename;
    const userId = req.authenticatedId;

    try {
        const is_author = await Post.author_checker(posrId, userId);
        if (is_author !== true) {
            res.statusMessage = 'Forbidden';
            res.status(403)
                .send();
        } else {
            const delete_file = await PostPhoto.deletephoto(posrId, photoFilename);
            if (delete_file === null) {
                res.statusMessage = 'Not Found';
                res.status(404)
                    .send();
            } else {
                await Photos.deletePhoto(delete_file)
                res.statusMessage = 'OK';
                res.status(200)
                    .send();
            }
        }
    } catch(err){
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal Server Error';
        res.status(500)
            .send();
    }
};
exports.addPostPhoto = async function (req, res) {
    const posrId = req.params.id;
    const image = req.file;
    const userId = req.authenticatedId;
    try{
        const is_author = await Post.author_checker(posrId, userId);
        if (is_author !== true) {
            res.statusMessage = 'Forbidden';
            res.status(403)
                .send();
        } else {
            const fileExt = tools.getImageExtension(image.mimetype);
            const photoFilename = await Photos.storePhoto(image.buffer, fileExt);
            await PostPhoto.addPostPhotoLink(posrId, photoFilename);
            res.statusMessage = 'Create';
            res.status(201)
                .send();
        }
    }catch(err){
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal Server Error';
        res.status(500)
            .send();
    }
};


