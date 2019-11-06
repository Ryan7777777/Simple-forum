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