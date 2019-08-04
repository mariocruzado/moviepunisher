const jwt = require("jsonwebtoken");

const jwtSecret = "_wAstedBRainbutPretty2019-88%";
const model = require("../models/commentModel");

const ch = require("../util/reqCheckers");

const controller = {};

controller.add = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.body && ch.checkComment(req.body.comment)) {
      const objC = {
        review_id: req.params.reviewid,
        user_id: vToken.id,
        content: req.body.comment
      };
      console.log(objC);
      model
        .addComment(objC)
        .then(result => {
          const commentId = result.insertId;
          model.findCommentById(commentId).then(result => res.send(result[0]));
        })
        .catch(err => {
          res.status(400).send({ error: 400, message: "Bad Request" });
        });
    } else res.status(400).send({ error: 400, message: "Bad Request" });
  } catch {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

controller.byReviewId = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    model
      .findCommentsByReview(req.params.reviewid)
      .then(result => {
        if (result.length > 0) res.send(result);
        else
          res
            .send([]);
      })
      .catch(err =>
        res.status(400).send({ error: 400, message: "Bad Request" })
      );
  } catch {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

controller.byUserId = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.params.userid && !isNaN(req.params.userid)) {
      model
        .findCommentsByUser(req.params.userid)
        .then(result => {
          if (result.length > 0) res.send(result);
          else
            res.send([]);
        })
        .catch(err => {
          res.status(400).send({ error: 400, message: "Bad Request" });
        });
    } else res.status(400).send({ error: 400, message: "Bad Request" });
  } catch {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};

controller.getCommentById = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    model
      .findCommentById(req.params.id)
      .then(result => {
        if (result.length > 0) res.send(result[0]);
        else
          res.status(404).send({ error: "404", message: "Comment Not Found" });
      })
      .catch(err =>
        res.status(400).send({ error: 400, message: "Bad Request" })
      );
  } catch {
    res.status(401).send({ error: 401, message: "Unauthorized" });
  }
};
controller.delete = (req, res, _next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const vToken = jwt.verify(token, jwtSecret);
    if (req.params.id && !isNaN(req.params.id)) {
      model
        .findCommentById(req.params.id)
        .then(result => {
          if (result.length > 0) {
            const id2delete = result[0].id;
            if (result[0].user_id == vToken.id || vToken.isAdmin) {
              model
                .deleteComment(req.params.id)
                .then(result => {
                  res.send({ comment: id2delete, status: "Deleted" });
                })
                .catch(err => {
                  throw err;
                });
            } else
              res.status(401).send({ error: 401, message: "Unauthorized" });
          } else
            res.status(404).send({ error: 404, message: "Comment not found" });
        })
        .catch(err => {
          throw err;
        });
    } else res.status(400).send({ error: 400, message: "Bad Request" });
  } catch {
    res.status(400).send("Bad Request");
  }
};

module.exports = controller;
