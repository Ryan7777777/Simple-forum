const post = require('../controllers/post.controller');
const authenticate = require('../middleware/authenticate');

module.exports = function (app){
    app.route(app.rootUrl+'/newpost')
        .post(authenticate.loginRequired,post.create);
}