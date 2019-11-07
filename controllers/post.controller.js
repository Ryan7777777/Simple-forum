const Post = require('../model/post.model');
const validator = require('../services/validator');

exports.create = async function(req,res){
    const id = req.authenticatedId;
    let validation = validator.checkAgainstSchema(
        'Post',
        req.body
    );
    if (validation !== true){
        res.statusMessage = 'Bad request: ${validation}';
        res.status(400)
            .send();
    }  else{
        try{
           await Post.new_post(req.body.title,req.body.content,id)
            res.statusMessage = 'Create';
            res.status(201)
             .send();
        } catch(err){
            console.log(err);
            res.statuesMessage = 'Internal Server Error';
            res.status(500)
                .send();
        }
    }
};
exports.edit = async function(req,res){
    const user_id = req.authenticatedId;
    const author = await Post.author_checker(req.params.id,user_id);
    let validation = validator.checkAgainstSchema(
        'Post',
        req.body
    );
    if (validation!== true){
        res.statusMessage = 'Bad request: ${validation}';
        res.status(400)
            .send();
    } else if (author !== true){
        res.statusMessage = 'Forbidden';
        res.status(403)
            .send();
    } else{
        try{
            await Post.edit_post(req.params.id,req.body.title,req.body.content);
            res.statusMessage = 'Accepted';
            res.status(202)
                .send();
        } catch(err){
            console.log(err);
            res.statusMessage = "Internal Server Error";
            res.status(500)
                .send();
        }
    }
};
exports.getallpost = async function(req,res){
    try{
        const post =  await Post.allpost();
        res.statusMessage = "Ok";
        res.status(200)
            .json(post)
            .send();
    }catch(err){
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500)
            .send();
    }
};