const dbConn = require("../config/db");

const model = {};

//Get all comments of a review

const SQL_findCommentsByReview = () => `SELECT comment.id, comment.content, comment.date, comment.user_id, comment.review_id, user.username AS user_username, user.isadmin AS user_isadmin, profile.avatar AS profile_avatar
FROM comment
INNER JOIN user ON user.id = comment.user_id
INNER JOIN profile ON profile.id = user.profile_id
WHERE comment.review_id = ?`;

const SQL_findCommentsByUser = () => `SELECT comment.id, comment.content, comment.date, comment.review_id, comment.user_id, user.username AS user_username, user.isadmin AS user_isadmin, profile.avatar AS profile_avatar, review.title AS review_title, review.content AS review_content, review.rating AS review_rating, review.date as review_date
FROM comment
INNER JOIN user ON user.id = comment.user_id
INNER JOIN profile ON profile.id = user.profile_id
INNER JOIN review ON review.id = comment.review_id
WHERE comment.user_id = ?`

const SQL_findCommentById = () => `SELECT comment.id, comment.content, comment.date, comment.user_id, user.username AS user_username, profile.avatar AS profile_avatar, comment.review_id, review.title AS review_title, review.content AS review_content, review.rating AS review_rating 
FROM comment 
INNER JOIN user ON user.id = comment.user_id
INNER JOIN profile ON profile.id = user.profile_id
INNER JOIN review ON review.id = comment.review_id
WHERE comment.id = ?`;

const SQL_deleteCommentById = () => `DELETE FROM comment WHERE id = ?`;

const SQL_addComment = () => `INSERT INTO comment SET ?`

model.findCommentsByReview = review_id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_findCommentsByReview(), [review_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.deleteComment = id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_deleteCommentById(), [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.findCommentById = (id) => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_findCommentById(), [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.findCommentsByUser = user_id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_findCommentsByUser(), [user_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.addComment = objC => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_addComment(), [objC], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  })
}
module.exports = model;
