const jwt = require("jsonwebtoken");

//my secret
const jwtSecret = "_wAstedBRainbutPretty2019-88%";

const controller = {};

const model = require("../models/filmModel");

//Retrieve local films
controller.getFilms = (req, res, _next) => {
  try {
    model
      .getFilms()
      .then(results => {
        res.send(results);
      })
      .catch(err => {
        throw err;
      });
  } catch {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

//Get film info
controller.getFilm = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    model
      .getFilm(req.params.id)
      .then(result => {
        res.send(result[0]);
      })
      .catch(err => {
        throw err;
      });
  } catch (e) {
    res.status(400).send({ error: 400, message: e });
  }
};

//Add film to local database
controller.addFilm = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.body && req.params.id) {
      model
        .checkIfFilmExists(req.params.id)
        .then(result => {
          if (result.length > 0) {
            res.send({ included: true, message: "Film is in local list" });
          } else {
            const filmData = {
              id: +req.params.id,
              ...(req.body.poster_path && {
                poster_path: req.body.poster_path
              }),
              ...(req.body.original_title && {
                original_title: req.body.original_title
              }),
              ...(req.body.release_date && {
                release_date: req.body.release_date
              }),
              ...(req.body.overview && {
                overview: req.body.overview
              }),
              ...(req.body.original_language && {
                original_language: req.body.original_language
              })
            };
            model
              .addFilm(filmData)
              .then(_result => {
                res.send(filmData);
              })
              .catch(err => {
                throw err;
              });
          }
        })
        .catch(err => {
          throw err;
        });
    } else {
      res.status(400).send({ error: 400, message: "Bad Request" });
    }
  } catch (e) {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

controller.deleteFilm = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.params.id && !isNaN(req.params.id)) {
      model.deleteFilm(req.params.id)
        .then(_result => {
          res.send({ film: req.params.id, status: "Deleted" });
        })
        .catch(err => {
          throw err;
        });
    } else {
      throw err;
    }
  } catch {
    res.status(400).send({ error: 400, message: "Bad Request" });
  }
};

module.exports = controller;
