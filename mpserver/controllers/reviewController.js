const jwt = require("jsonwebtoken");

//my secret
const jwtSecret = "_wAstedBRainbutPretty2019-88%";
const model = require("../models/reviewModel");

const ch = require("../util/reqCheckers");

const controller = {};

controller.getAllReviews = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    model
      .getAllReviews()
      .then(result => {
        if (result.length > 0) {
          res.send(result);
        } else res.send([]);
      })
      .catch(err => {
        res.status(400).send({ error: "400", message: "Bad Request" });
      });
  } catch (e) {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

controller.getReviewById = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    model
      .getReviewById(req.params.id)
      .then(result => {
        if (result.length > 0) {
          res.send(result[0]);
        } else
          res.status(404).send({ error: "404", message: "Review Not Found" });
      })
      .catch(err => {
        res.status(400).send({ error: "400", message: "Bad Request" });
      });
  } catch (e) {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

controller.getReviewsByFilm = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    model
      .getReviewsByFilm(req.params.id)
      .then(result => {
        if (result.length > 0) {
          res.send(result);
          console.log(result);
        } else res.send([]);
      })
      .catch(err => {
        res.status(400).send({ error: "400", message: "Bad Request" });
      });
  } catch (e) {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

controller.getReviewsByUser = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    model
      .getReviewsByUser(req.params.id)
      .then(result => {
        if (result.length > 0) {
          res.send(result);
        } else res.send([]);
      })
      .catch(err => {
        res.status(400).send({ error: "400", message: "Bad Request" });
      });
  } catch (e) {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

//Check if user reviewed the film
controller.checkIfReviewed = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.params.film_id) {
      model.checkifUserReviewed(vToken.id, req.params.film_id).then(result => {
        if (result.length > 0) {
          res.status(409).send({
            error: 409,
            message: "Another previous review exists for this film"
          });
        } else {
          res.send(result);
        }
      });
    } else res.status(400).send({ error: 400, message: "Bad Request" });
  } catch {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};
//Add Review

controller.addReview = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (
      req.body &&
      ch.checkReviewTitle(req.body.title) &&
      ch.checkReviewRating(req.body.rating) &&
      !isNaN(req.params.filmid)
    ) {
      model
        .checkifUserReviewed(vToken.id, req.params.filmid)
        .then(result => {
          if (result.length > 0) {
            console.log("Another previous review exists for this film");
            res.status(409).send({
              error: 409,
              message: "Another previous review exists for this film"
            });
          } else {
            const objR = {
              film_id: req.params.filmid,
              user_id: vToken.id,
              title: req.body.title,
              ...(req.body.content &&
                ch.checkReviewContent(req.body.content) && {
                  content: req.body.content
                }),
              rating: req.body.rating
            };
            model
              .addReview(objR)
              .then(result => {
                const reviewId = result.insertId;
                model.getReviewById(reviewId).then(result => {
                  res.send(result[0]);
                });
              })
              .catch(err => {
                throw err;
              });
          }
        })
        .catch(err => {
          throw err;
        });
    } else res.status(400).send({ error: 400, message: "Invalid Data" });
  } catch (e) {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

controller.deleteReview = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.params.id && !isNaN(req.params.id)) {
      model
        .getReviewById(req.params.id)
        .then(async result => {
          if (result.length > 0) {
            const revToDelete = result[0].id;

            if (result[0].user_id == vToken.id || vToken.isAdmin) {
              await model.deleteReviewComments(req.params.id);

              model
                .deleteReview(req.params.id)
                .then(result => {
                  res.send({ review: revToDelete, status: "Deleted" });
                })
                .catch(err => {
                  throw err;
                });
            } else
              res.status(401).send({ error: 401, message: "Unauthorized" });
          } else
            res.status(404).send({ error: 404, message: "Review Not Found" });
        })
        .catch(err => {
          throw err;
        });
    } else res.status(400).send({ error: 400, message: "Bad Request" });
  } catch {
    res.status(400).send("Bad Request");
  }
};

controller.editReview = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.params.id && !isNaN(req.params.id)) {
      model.getReviewById(req.params.id).then(result => {
        if (result.length > 0) {
          if (result[0].user_id == vToken.id || vToken.isAdmin) {
            const objR = {
              ...(req.body.title &&
                ch.checkReviewTitle(req.body.title) && {
                  title: req.body.title
                }),
              ...(req.body.content &&
                ch.checkReviewContent(req.body.content) && {
                  content: req.body.content
                }),
              ...(req.body.rating &&
                ch.checkReviewRating(req.body.rating) && {
                  rating: req.body.rating
                }),
              modifiedby: vToken.id
            };
            model
              .editReview(objR, req.params.id)
              .then(result => {
                model
                  .getReviewById(req.params.id)
                  .then(result => res.send(result[0]))
                  .catch(err => {
                    throw err;
                  });
              })
              .catch(err =>
                res.status(400).send({ error: 400, message: "Bad Request" })
              );
          } else res.status(401).send({ error: 401, message: "Unauthorized" });
        } else
          res.status(404).send({ error: 404, message: "Review Not Found" });
      });
    }
  } catch {
    res.status(401).send("Unauthorized");
  }
};

controller.getReviewsAndAverage = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const vToken = jwt.verify(token, jwtSecret);

    const body = req.body.toString();
    const body2 = body.replace("[", "(");
    const body3 = body2.replace("]", ")");
    
    model
      .reviewsAverage(body3)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        throw err;
      });
  } catch {
    res.status(401).send("Unauthorized");
  }
};
module.exports = controller;
