const jwt = require("jsonwebtoken");
const sha1 = require("node-sha1");

//my secret
const jwtSecret = "_wAstedBRainbutPretty2019-88%";

//tools to check signup data
const ch = require("../util/reqCheckers");

//model
const model = require("../models/adminModel");

const controller = {};

//Get user info
controller.getUserById = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (vToken.isAdmin && req.params.id) {
      model
        .userDetailsById(req.params.id)
        .then(result => {
          if (result.length > 0) res.send(result[0]);
          else res.status(404).send({ error: 404, message: "User Not Found" });
        })
        .catch(err => {
          res.status(400).send({ error: 400, message: "Bad Request" });
        });
    } else throw err;
  } catch (e) {
    res.status(400).send({ error: 400, message: "Unauthorized/Invalid User" });
  }
};

//List all users
controller.listUsers = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (vToken.isAdmin) {
      model
        .getAll()
        .then(result => {
          if (result.length > 0) res.send(result);
          else
            res.status(404).send({ error: 404, message: "Users list empty" });
        })
        .catch(err =>
          res.status(400).send({ error: 400, message: "Bad Request" })
        );
    } else throw err;
  } catch (e) {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

//Create new User
controller.newUser = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (vToken.isAdmin && req.body) {
      if (
        ch.checkUserName(req.body.username) &&
        ch.checkEmail(req.body.email) &&
        ch.checkPassword(req.body.password) &&
        ch.checkProfileId(req.body.profile_id)
      ) {
        //Creating object with user data
        const objU = {
          username: req.body.username,
          password: sha1(req.body.password),
          email: req.body.email,
          profile_id: req.body.profile_id,
          ...(req.body.description && { description: req.body.description }),
          ...(req.body.isadmin && { isadmin: req.body.isadmin }),
          ...(req.body.points && { points: req.body.points })
        };

        model
          .checkUser(objU) //Checking if user already exists
          .then(result => {
            if (result.length > 0) {
              res
                .status(409)
                .send({ error: 409, message: "User already exists" });
            } else {
              model.newUser(objU).then(result => {
                const userId = result.insertId;
                model.userById(userId).then(result => {
                  res.send(result[0]);
                });
              });
            }
          })
          .catch(err => res.status(400).send({ error: 400, message: err }));
      } else res.status(400).send({ error: 400, message: "Invalid Data" });
    } else res.status(401).send({ error: 401, message: "Unauthorized" });
  } catch (e) {
    res.status(400).send({ error: 400, message: "Bad Request/Invalid Data" });
  }
};

//Edit an user (with admin credentials)
controller.editUser = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (vToken.isAdmin) {
      model.userById(req.params.id).then(result => {
        if (result.length > 0 && req.body) {
            const userId = result[0].id;
          const objU = {
            ...(req.body.username && { username: req.body.username }),
            ...(req.body.email && { email: req.body.email }),
            ...(req.body.password &&
              ch.checkPassword(req.body.password) && {
                password: sha1(req.body.password)
              }),
            ...(req.body.description && { description: req.body.description }),
            ...(req.body.profile_id &&
              ch.checkProfileId(req.body.profile_id) && {
                profile_id: req.body.profile_id
              }),
            ...(req.body.isadmin && { isadmin: req.body.isadmin }),
            ...(req.body.points && { points: req.body.points }),
            ...(req.body.isbanned && { isbanned: req.body.isbanned }),
            id: userId
          };

          model
            .editUser(req.params.id, objU)
            .then(result => {
              model
                .userById(req.params.id)
                .then(result => res.send(result[0]))
                .catch(err => {
                  throw err;
                });
            })
            .catch(err => {
              throw err;
            });
        } else
          res
            .status(400)
            .send({ error: 400, message: "Invalid Data/User Not Found" });
      });
    } else throw err;
  } catch (e) {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

module.exports = controller;
