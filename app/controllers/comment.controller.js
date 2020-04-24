const comment = require('../model/comment.model');
const validator = require('../services/validator');

exports.newcomment = async function(req,res){
    const user_id = req.authenticatedId;
    let validation = validator.checkAgainstSchema(
        'Post',
        req.body
    );
    if(validation!==true){
        res.statusMessage = 'Bad request: ${validation}';
        res.status(400)
            .send();
    } else{
        try{
            const action = await comment.new_comment(user_id,req.body.content,req.params.id);
            if(action === null){
                res.stateMessage = "Forbidden";
                res.status(403)
                    .send();
            }
            res.stateMessage = "Create";
            res.status(201)
                .send();
        }catch(err) {
            console.log(err);
            res.stateMessage = "Internal Server Error";
            res.state(500)
                .send();
        }
    }
};
exports.editcomment = async function(req,res) {
    const user_id = req.authenticatedId;
    const post_id = req.params.id;
    let validation = validator.checkAgainstSchema(
        'Post',
        req.body
    );
    if (validation !== true) {
        res.statusMessage = 'Bad request: ${validation}';
        res.status(400)
            .send();
    } else{
        try{
            const change = await comment.editcomment(user_id,req.body.content,post_id)
            if (change === true) {
                res.stateMessage = "Ok";
                res.status(200)
                    .send();
            }else if( change === null){
                res.stateMessage = "Forbidden";
                res.status(403)
                    .send();
            } else{
                res.stateMessage = "Bad Request";
                res.status(400)
                    .send();
            }
        } catch(err){
            console.log(err);
            res.stateMessage = "Internal Server Error";
            res.state(500)
                .send();
        }
    }
};
exports.deletecomment = async function(req,res) {
    const user_id = req.authenticatedId;
    try {
        const change = await comment.deletecomment(user_id,req.params.id);
        if (change === true) {
            res.stateMessage = "Ok";
            res.status(200)
                .send();
        }else if( change === null){
            res.stateMessage = "Forbidden";
            res.status(403)
                .send();
        } else{
            res.stateMessage = "Bad Request";
            res.status(400)
                .send();
        }
        } catch (err) {
            console.log(err);
            res.statusMessage = "Internal Server Error";
            res.status(500)
                .send();
        }
};
exports.getallcomment  = async function(req,res){
    try{
        const allcomments  = await comment.allcomment(req.params.id);
        res.statusMessage = 'Ok';
        res.status(200)
            .json(allcomments)
            .send();
    } catch(error){
        console.error(error);
        res.statusMessage = 'Internal Server Error';
        res.status(500)
            .send();
    }
};
