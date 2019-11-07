const comment = require('../controllers/comment.controller');
const authenticate = require('../middleware/authenticate');

module.exports = function (app){
    app.route(app.rootUrl+'/newcommon/:id')
        .post(authenticate.loginRequired,comment.newcomment);
};