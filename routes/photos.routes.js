const userPhotos  = require('../controllers/usersphotos.controller');
const authenticate = require('../middleware/authenticate');

module.exports = function (app){
    app.route(app.rootUrl+'/users/:id/photo')
        .get(userPhotos.getProfilePhoto)
        .put(authenticate.loginRequired,userPhotos.setProfilePhoto)
        .delete(authenticate.loginRequired,userPhotos.deleteProfilePhoto);
};