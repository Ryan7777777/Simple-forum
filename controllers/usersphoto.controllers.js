const users = require('../model/users.model');
const photos = require('../model/usersphoto.model');

exports.getProfilePic = async function(req,res){
    try{
        const filename = await  users.getProfilePicName(req.params.id);
        if(filename == null){
            res.statusMessage = 'Not Found';
            res.status(404)
                .send();
        } else{
            const image = await photos.getPhoto(filename);
            res.statusMessage = "Ok";
            res.status(200)
                .contentType(image.mimeType)
                .send(image.image);
        }
    } catch(err){
        if(!err.hasBeenLogged) console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500)
            .send();
    }
};
exports.deleteProfilePic = async function (req, res) {
    const userId = req.params.id;

    const user = await users.findById(req.params.id);
    if (!user) {
        res.statusMessage = 'Not Found';
        res.status(404)
            .send();
        return;
    }

    // Check that the authenticated user
    if (userId !== req.authenticatedUserId) {
        res.statusMessage = 'Forbidden';
        res.status(403)
            .send();
    } else {
        try {
            const photoFilename = await users.getProfilePhotoFilename(userId);
            if (photoFilename == null) {
                res.statusMessage = 'Not Found';
                res.status(404)
                    .send();
            } else {
                await Promise.all([
                    photos.deletePhoto(photoFilename),
                    users.setProfilePhotoFilename(userId, null)
                ]);
                res.statusMessage = 'OK';
                res.status(200)
                    .send();
            }
        } catch (err) {
            if (!err.hasBeenLogged) console.error(err);
            res.statusMessage = 'Internal Server Error';
            res.status(500)
                .send();
        }
    }
};