const message = require('../controllers/message.controller');
const authenticate = require('../middleware/authenticate');

module.exports = function (app){
    app.route(app.rootUrl+'/message/:id')
        .get(authenticate.loginRequired,message.getmessage)
        .post(authenticate.loginRequired,message.postmessage);
    app.route(app.rootUrl+'/message/delete/:id')
        .delete(authenticate.loginRequired,message.deletemessage);
};