const comment = require('../controllers/comment.controller');
const authenticate = require('../middleware/authenticate');

module.exports = function (app){
    app.route(app.rootUrl+'/newcomment/:id')
        .post(authenticate.loginRequired,comment.newcomment);
    app.route(app.rootUrl+'/editcomment/:id')
        .patch(authenticate.loginRequired,comment.editcomment);
    app.route(app.rootUrl+'/delete/comment/:id')
        .delete(authenticate.loginRequired,comment.deletecomment);
    app.route(app.rootUrl+'/comment/:id')
        .get(comment.getallcmment);
};