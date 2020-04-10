const users = require('../controllers/users.controller');
const authenticate = require('../middleware/authenticate');

module.exports = function (app) {
    app.route(app.rootUrl + '/users')
        .post(users.create);
    app.route(app.rootUrl + '/users/login')
        .post(users.login);
    app.route(app.rootUrl + '/users/logout')
        .post(authenticate.loginRequired,users.logout);
    app.route(app.rootUrl +'/users/namechange/:id')
        .get(authenticate.setAuthenticatedUser,users.getinfo)
        .patch(authenticate.loginRequired,users.namechange);
    app.route(app.rootUrl+'/users/pwchange/:id')
        .patch(authenticate.loginRequired,users.pwchange);
    app.route(app.rootUrl+'/users/checkemail')
        .get(users.emailvalidcheck);
};
