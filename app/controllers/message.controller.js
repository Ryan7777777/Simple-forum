const message = require('../model/message.model');
const validator = require('../services/validator');
const Users = require('../model/users.model');

exports.getmessage = async function(req,res){
    const user_id = req.authenticatedId;
    const reciver_id = req.params.id
    try{
        const messages = await message.allmessage(user_id,reciver_id);
        res.statusMessage = 'Ok';
        res.status(200)
            .json(messages)
            .send();
    } catch(error){
        console.error(error);
        res.statusMessage = 'Internal Server Error';
        res.status(500)
            .send();
    }
};
exports.postmessage = async function(req,res){
    const user_id = req.authenticatedId;
    const reciver_id = req.params.id;
    const reciver = await Users.findById(reciver_id);
    let validation = validator.checkAgainstSchema(
        'Message',
        req.body
    );
    if(validation !== true){
        res.statusMessage = `Bad request: ${validation}`;
        res.status(400)
            .send ();
    } else if (reciver === null) {
        res.statusMessage = 'Forbidden';
        res.status(403)
            .send();
    }
    else {
        try{
            await message.newmessage(user_id,reciver_id,req.body)
            res.statusMessage = 'Create';
            res.status(200)
                .json()
                .send();
        } catch(error){
            console.log(error);
            res.statusMessage = 'Internal Server Error';
            res.status(500)
            .send();
        }
    }
};
exports.deletemessage = async function(req,res){
    const user_id = req.authenticatedId;
    const message_id = req.params.id;
    const message_alive = await message.checkmessagealive(user_id,message_id);
    if (message_alive===null){
        res.statusMessage = 'Not Found';
        res.status(404)
            .send();
    }else {
        try {
            await message.deletemessage(message_id)
            res.statusMessage = 'Ok';
            res.status(200)
                .send();
        } catch (error) {
            console.log(error);
            res.statusMessage = 'Internal Server Error';
            res.status(500)
                .send();
        }
    }
};


