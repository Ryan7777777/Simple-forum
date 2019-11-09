const db = require('../config/db');
const errors = require('../services/errors');

exports.allmessage = async function(sender,revicier){
    const get_all_sender_query  = "SELECT message, u1.user_name AS sender,u2.user_name AS reciver, time FROM  message JOIN forum_db.user u1 ON message.send = u1.user_id JOIN forum_db.user u2 ON message.send = u2.user_id WHERE message.send = ? AND message.recive = ? ORDER BY message.time DESC;";
    try{
        const rows = await db.getPool().query(get_all_sender_query,[sender,revicier]);
        return rows.map(rows=> ({
            'message' : rows.message,
            'from' : rows.sender,
            'to' : rows.reciver,
            'time':  rows.time

        }));
    } catch(err){
        errors.logSqlError(err);
        throw err
    }
};
exports.newmessage = async function(sender,reciver,body){
    const new_message_query = "INSERT INTO message(send, recive, message ,time) VALUES (?, ? ,?,?)";
    try{
      const result = await db.getPool().query(new_message_query,[parseInt(sender),parseInt(reciver),body.message,new Date()]);
    } catch(err){
        errors.logSqlError(err);
        throw err
    }
};
exports.deletemessage = async function(messageId){
    const delete_query = "DELETE FROM message WHERE idmessage = ? ";
    try{
       await db.getPool().query(delete_query,[messageId]);
    } catch(err){
        errors.logSqlError(err);
        throw err
    }
};
exports.checkmessagealive = async function(userId,messageId){
    const alive_query = "SELECT * FROM message WHERE idmessage = ? and send = ? ";
    try{
        const rows = await db.getPool().query(alive_query,[messageId,userId]);
        if (rows.length <= 0){
            return null
        }
    } catch(err){
        errors.logSqlError(err);
        throw err
    }
};