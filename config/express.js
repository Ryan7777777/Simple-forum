const express = require('express');
const bodyParser = require('body-parser');
const allowCrossOriginRequests = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    next();
};


module.exports = function () {
    // INITIALISE EXPRESS //
    const app = express();
    app.use(bodyParser.json());
    app.use(allowCrossOriginRequests);
    app.use((req, res, next) => {
        console.log(`##### ${req.method} ${req.path} #####`);
        next();
    });
    app.rootUrl = '/api/v1';

    //ROUTES//
    require('../routes/users.routes')(app);
    require('../routes/post.routes')(app);
    return app;
};