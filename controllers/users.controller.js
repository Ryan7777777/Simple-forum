const Users = require('../model/users .model');
const validator = require('../services/validator');
const passwords = require('../services/passwords');
function isValidEmail(email){
    return email.includes('@')
}
exports.create = async function(req,res){
    let validation = validator.checkAgainstSchema(
        'User',
        req.body
    );
    //Valifation for email address
    if(validation === true && !isValidEmail(req.body.email)){
        validation = "data.email must be a valid email address"
    }
    if(validation!== true){
        res.stateMessage = 'Bad Request :${validation}';
        res.status(400)
            .send();
    }else {
        try {
            const userId = await Users.create(req.body);
            res.statusMessage = 'Created';
            res.status(201)
                .json({userId});
        } catch (err) {
            if (err.sqlMessage && err.sqlMessage.includes('Duplicate entry')) {
                // Either username or email was already in use
                res.statusMessage = 'Bad Request: username or email already in use';
                res.status(400)
                    .send();
            } else {
                if (!err.hasBeenLogged) console.error(err);
                res.statusMessage = 'Internal Server Error';
                res.status(500)
                    .send();
            }
        }
    }
};
exports.login = async function(req,res) {
    try {
        const foundUser = await Users.findByUser(req.body.username, req.body.email);
        if (foundUser != null) {
            const passwordCorrect = await passwords.compare(req.body.password, foundUser.password);
            if (passwordCorrect) {
                const loginResult = await Users.login(foundUser.userId);
                res.statusMessage = 'OK';
                res.status(200)
                    .json(loginResult);
            }
        }

        // Either no user found or password check failed
        res.statusMessage = 'Bad Request: invalid username/email/password supplied';
        res.status(400)
            .send();

    } catch (err) {
        // Something went wrong with either password hashing or logging in
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal Server Error';
        res.status(500)
            .send();
    }
};
exports.logout = async function(req,res) {
    const id = req.authenticatedId;
    const token = req.header('X-Authorization');
    try{
        await Users.logout(id,token);
        res.statutsMessage = "Succceddful";
        res.status(200)
            .send();
    }catch(err){
        if(!err.hasBeenLogged) console.log(err)
            res.statusMessage = "Internal Server Error";
            res.status(500)
                .send();
    }
}
