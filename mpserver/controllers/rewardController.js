const jwt = require("jsonwebtoken");

//my secret
const jwtSecret = "_wAstedBRainbutPretty2019-88%";

const model = require("../models/rewardModel");
const controller = {};

//Retrieve prizes per user
controller.getPrizesByUser = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.params.id && !isNaN(req.params.id)) {
      model
        .getPrizes(req.params.id)
        .then(result => {
          res.send(result);
        })
        .catch(err => {
          throw err;
        });
    } else throw err;
  } catch (e) {
    res.status(400).send({ error: 400, message: e });
  }
};

module.exports = controller;