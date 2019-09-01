const jwt = require("jsonwebtoken");
const sha1 = require("node-sha1");

//my secret
const jwtSecret = "_wAstedBRainbutPretty2019-88%";

//tools to check signup data
const ch = require("../util/reqCheckers");

//model
const model = require("../models/userModel");

const controller = {};

//New User SignUp
controller.register = (req, res, _next) => {
  try {
    if (req.body) {
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
          ...(req.body.description && { description: req.body.description })
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
                })
              });
            }
          })
          .catch(err => res.status(400).send({ error: 400, message: err }));
      } else throw err;
    } else throw err;
  } catch (e) {
    res.status(400).send({ error: 400, message: "Bad Request" });
  }
};

//User editing himself
controller.edit = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (vToken.id == req.params.id) {
      model.userById(req.params.id).then(result => {
        if (result.length > 0 && req.body) {
          const userId = result[0].id;
          const objU = {
            ...(req.body.password &&
              ch.checkPassword(req.body.password) && {
                password: sha1(req.body.password)
              }),
            ...(req.body.description && { description: req.body.description }),
            ...(req.body.profile_id &&
              ch.checkProfileId(req.body.profile_id) && {
                profile_id: req.body.profile_id
              }),
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
    } else res.status(401).send({ error: 401, message: 'Unauthorized '});
  } catch (e) {
    res.status(400).send({ error: 400, message: "Bad Request" });
  }
};

//Get detailed user

controller.getById = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.params.id) {
      model
        .userDetailsById(req.params.id)
        .then(result => {
          if (result.length > 0) res.send(result[0]);
          else res.status(404).send({ error: 404, message: 'User Not Found'});
        })
        .catch(err => {
          res.status(400).send({ error: 400, message: "Bad Request" });
        });
    } else throw err;
  } catch (e) {
    res.status(400).send({ error: 400, message: "Unauthorized" });
  }
};

//Get all users
controller.getAll = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const vToken = jwt.verify(token, jwtSecret);
    model
      .getAll()
      .then(result => {
        if (result.length > 0) res.send(result);
        else throw err;
      })
      .catch(err =>
        res.status(400).send({ error: 400, message: "Bad Request" })
      );
  } catch (e) {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

//delete own account (default User)/selected account (if Admin)

controller.deleteUser = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const vToken = jwt.verify(token, jwtSecret);
    console.log(vToken.id, req.params.id);
    if (+vToken.id === +req.params.id && !vToken.isAdmin || vToken.isAdmin) {
      model.userById(req.params.id)
      .then(async(result) => {
        const userToDelete = result[0];
        //We need to remove all comments & reviews from user first
        await model.deleteComments(userToDelete.id);
        await model.deleteReviews(userToDelete.id);

        //We also remove rewards earned by user
        await model.deleteRewards(userToDelete.id);

        //Then we can delete user
        model.deleteUser(userToDelete.id)
          .then(_result => {
            res.send({ user: userToDelete.id, status: 'Deleted'});
          })
          .catch((err) => { throw err });
      })
      .catch((err) => res.status(404).send({ error: 404, message: 'User Not Found'}));
    } else throw err;
  } catch (e) {
    res.status(400).send({ error: 401, message: "Unauthorized" });
  }
};

//Get profiles 
controller.getProfiles = (req, res, _next) => {
  model.getProfiles()
  .then(result => {
    res.send(result)
  })
  .catch((err) => { console.log(err) });
}
module.exports = controller;
