const db = require('../config/db');
const passwords = require('../services/passwords');
const errors = require ('../services/errors')

exports.create = async function (user) {
    const createSQL = 'INSERT INTO User (user_name, user_email, user_first_name, user_last_name, user_password) VALUES (?, ?, ?, ?, ?)';

    const userData = [
        user.username,
        user.email,
        user.given_name,
        user.family_name,
        await passwords.hash(user.password),
    ];
    try {
        const result = await db.getPool().query(createSQL, userData);
        return result.insertId;
    } catch (err) {
        errors.logSqlError(err);
        throw err;
    }
};
