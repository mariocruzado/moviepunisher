const dbConn = require("../config/db");

const model = {};

//Get all comments of a review

const SQL_findCommentsByReview = () => `SELECT comment.id, comment.content, comment.user_id, comment.review_id, user.username AS user_username, user.isadmin AS user_isadmin, profile.name AS profile_name, profile.avatar AS profile_avatar
FROM comment
INNER JOIN user ON user.id = comment.user_id
INNER JOIN profile ON profile.id = user.profile_id
WHERE comment.review_id = ?´ 
`;

const SQL_findCommentById = () => `SELECT * FROM Comment WHERE id = ?`;
const SQL_deleteCommentById = () => `DELETE FROM comment WHERE id = ?`;

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

model.findCommentById = () => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_findCommentById(), [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = model;
