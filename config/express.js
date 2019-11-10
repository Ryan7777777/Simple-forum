const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const allowCrossOriginRequests = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    next();
};

const jsonParser = bodyParser.json();
const upload = multer({ limits: { fileSize: 20e6 } });
const multipartParser = upload.single('photo');  // 20 MB

function rawParser (req, res, next) {
    let data = new Buffer('');
    req.on('data', function (chunk) {
        data = Buffer.concat([data, chunk]);
    });
    req.on('end', function () {
        req.body = data;
        next();
    });
};

function dynamicBodyParser(req, res, next) {
    const contentType = req.header('Content-Type') || '';
    if (contentType === 'image/jpeg' || contentType === 'image/png' || contentType === 'text/plain') {
        rawParser(req, res, next);
    } else if (contentType.startsWith('multipart/form-data')) {
        multipartParser(req, res, next);
    } else {
        jsonParser(req, res, next);
    }
}
module.exports = function () {
    // INITIALISE EXPRESS //
    const app = express();
    app.use(dynamicBodyParser);
    app.use(allowCrossOriginRequests);
    app.use((req, res, next) => {
        console.log(`##### ${req.method} ${req.path} #####`);
        next();
    });
    app.rootUrl = '/api/v1';

    //ROUTES//
    require('../routes/users.routes')(app);
    require('../routes/post.routes')(app);
    require('../routes/comment.routes')(app);
    require('../routes/message.routes')(app);
    require('../routes/photos.routes')(app);
    return app;
};