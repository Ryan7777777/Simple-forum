const mysql = require('promise-mysql');

let pool = null;

exports.createPool = async function () {
    pool = mysql.createPool({
        multipleStatements: true,
        host:'127.0.0.1:3306',
        user:'ryan',
        password: 'Nemo0422003',
        database:'client'
    });
};

exports.getPool = function () {
    return pool;
};
