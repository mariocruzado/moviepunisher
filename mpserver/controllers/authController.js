//JWT for generating & signing tokens
const jwt = require('jsonwebtoken');
//Crypting using Sha1
const sha1 = require('node-sha1');

//Loading model
const model = require('../models/loginModel');
const controller = {};

const jwtSecret = '_wAstedBRainbutPretty2019-88%';

controller.welcome = (req, res) => {
    res.json({
        status:'Running',
        message: 'Welcome to MoviePunisher API'
    });
}

controller.login = (req, res, _next) => {
    const username = req.body.username;
    const password = req.body.password;
    model.authUser(username, password)
    .then(result => {
        if (result.length > 0) {
            if (result[0].isbanned) {
                res.status(403).send({ error: 403, message: 'User is banned'});
            } else {
                console.log(result);
                const token = jwt.sign({
                    id: result[0].id,
                    username: result[0].username,
                    isAdmin: result[0].isadmin?true:false
                },
                jwtSecret, {
                    expiresIn:7200 //2 hours
                });
                res.send(token);
            }

        } else {
            res.status(400).send({ error: 400, message: 'Invalid Credentials' });

        }
    })
    .catch((err) => res.status(400).send({ error: 400, message: err}));
}

module.exports = controller;
