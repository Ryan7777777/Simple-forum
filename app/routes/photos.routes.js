const userPhotos  = require('../controllers/usersphotos.controller');
const authenticate = require('../middleware/authenticate');
const postPhotos = require ("../controllers/postphotos.controller");
const commentPhotos = require("../controllers/commentphotos.controller");
module.exports = function (app){
    app.route(app.rootUrl+'/users/:id/photo')
        .get(userPhotos.getProfilePhoto)
        .post(authenticate.loginRequired,userPhotos.setProfilePhoto)
        .delete(authenticate.loginRequired,userPhotos.deleteProfilePhoto);
    app.route(app.rootUrl+'/post/:id/photo')
        .post(authenticate.loginRequired,postPhotos.addPostPhoto);
    app.route(app.rootUrl+'/post/:id/photodelete/:filename')
        .delete(authenticate.loginRequired,postPhotos.deletePostPhoto);
    app.route(app.rootUrl+'/post/:id/photo/:filename')
        .get(postPhotos.getPostPhotos);
    app.route(app.rootUrl+'/comment/:id/photo')
        .post(authenticate.loginRequired,commentPhotos.addPostPhoto);
    app.route(app.rootUrl+'/comment/:id/photodelete/:filename')
        .delete(authenticate.loginRequired,commentPhotos.deletePostPhoto);
    app.route(app.rootUrl+'/comment/:id/photo/:filename')
        .get(commentPhotos.getPostPhotos);

};