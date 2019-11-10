const post = require('../controllers/post.controller');
const authenticate = require('../middleware/authenticate');

module.exports = function (app){
    app.route(app.rootUrl+'/newpost')
        .post(authenticate.loginRequired,post.create);
    app.route(app.rootUrl+'/editpost/:id')
        .patch(authenticate.loginRequired,post.edit);
    app.route(app.rootUrl+'/allpost')
        .get(post.getallpost);
    app.route(app.rootUrl+'/delete/post/:id')
        .delete(authenticate.loginRequired,post.deletepost);
};