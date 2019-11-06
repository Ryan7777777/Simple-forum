const db = require('../config/db');
const passwords = require('../services/passwords');
const errors = require ('../services/errors')
const randtoken = require('rand-token');


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
exports.findByUser = async function (username, email) {
    const findSQL = 'SELECT user_id, user_name, user_first_name, user_last_name, user_password, user_email ' +
        'FROM User WHERE user_name = ? OR user_email = ?';

    try {
        const rows = await db.getPool().query(findSQL, [username, email]);
        if (rows.length < 1) {
            return null;
        } else {
            let foundUser = rows[0];
            return {
                'userId': foundUser.user_id,
                'username': foundUser.user_name,
                'givenName': foundUser.user_first_name,
                'familyName': foundUser.user_last_name,
                'password': foundUser.user_password,
                'email': foundUser.user_email,
            }
        }
    } catch (err) {
        errors.logSqlError(err);
        return null;
    }
};
exports.login = async function (userId) {
    const loginSQL = 'UPDATE User SET user_authentication = ? WHERE user_id = ?';
    const token = randtoken.generate(32);

    try {
        await db.getPool().query(loginSQL, [token, userId]);
        return {
            'userId': userId,
            'token': token
        }
    } catch (err) {
        errors.logSqlError(err);
        throw err;
    }
};
exports.logout =async function(userId){
    const logoutSQL = 'UPDATE User Set user_authentication = NULL WHERE user_id = ?';
    try{
        await db.getPool().query(logoutSQL,[userId]);
    } catch(err){
        error.logSqlError(err);
        throw err;
    }
};
exports.findById = async function (userId) {
    const findSQL = 'SELECT  user_name, user_first_name, user_last_name, user_email ' +
        'FROM User WHERE user_id = ?';

    try {
        const rows = await db.getPool().query(findSQL, [userId]);
        if (rows.length < 1) {
            return null;
        } else {
            let foundUser = rows[0];
            return {
                'username': foundUser.user_name,
                'email': foundUser.user_email,
                'first_name': foundUser.user_first_name,
                'last_name': foundUser.user_last_name
            }
        }
    } catch (err) {
        errors.logSqlError(err);
        return null;
    }
};
exports.name_modify = async function(userId,new_name){
    const name_update_sql = 'UPDATE User Set user_name = ? WHERE user_id = ?';
    try{
       await db.getPool().query(name_update_sql,[new_name,userId]);
    } catch(err){
        errors.logSqlError(err);
        throw err;
    }
};

