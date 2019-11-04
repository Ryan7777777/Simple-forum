const express = require('express');

module.exports = function () {
    // INITIALISE EXPRESS //
    const app = express();
    app.use((req, res, next) => {
        console.log(`##### ${req.method} ${req.path} #####`);
        next();
    });
}