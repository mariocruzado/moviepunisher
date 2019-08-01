const dbConn = require("../config/db");

const model = {};

//Check if user has written a review about a film
const SQL_checkIfUserReviewed = () =>
  `SELECT id FROM review WHERE user_id = ? AND film_id = ?`;

//Get a detailed Review
const SQL_findReviewById = () => `SELECT review.id, review.film_id, review.user_id, review.title, review.content, review.rating, review.date, review.modifiedby, user.username AS user_username, user.isadmin AS user_isadmin, profile.name AS profile_name, profile.avatar AS profile_avatar
FROM review
INNER JOIN user ON user.id = review.user_id 
INNER JOIN profile ON profile.id = user.profile_id
WHERE review.id = ?`;

//Get all reviews by film ID
const SQL_findReviewsByFilm = () => `SELECT review.id, review.film_id, review.user_id, review.title, review.content, review.rating, review.date, review.modifiedby, user.username AS user_username, user.isadmin AS user_isadmin, profile.name AS profile_name, profile.avatar AS profile_avatar
FROM review
INNER JOIN user ON user.id = review.user_id 
INNER JOIN profile ON profile.id = user.profile_id
WHERE review.film_id = ? ORDER BY review.date DESC`;

//Get all reviews by user ID
const SQL_findReviewsByUser = () => `SELECT review.id, review.film_id, review.user_id, review.title, review.content, review.rating, review.date, review.modifiedby, user.username AS user_username, user.isadmin AS user_isadmin, profile.name AS profile_name, profile.avatar AS profile_avatar
FROM review
INNER JOIN user ON user.id = review.user_id 
INNER JOIN profile ON profile.id = user.profile_id
WHERE review.user_id = ?`;

//Get all reviews
const SQL_findAllReviews = () => `SELECT review.id, review.film_id, review.user_id, review.title, review.content, review.rating, review.date, review.modifiedby, user.username AS user_username, user.isadmin AS user_isadmin, profile.name AS profile_name, profile.avatar AS profile_avatar
FROM review
INNER JOIN user ON user.id = review.user_id 
INNER JOIN profile ON profile.id = user.profile_id`;

//Get data from view to get number of reviews and average rating
const SQL_reviews_avg = (filmsids) =>
  `SELECT * FROM moviepunisher.movies_reviews WHERE film_id IN (${filmsids})`;

//Add new review
const SQL_addReview = () => `INSERT INTO review SET ?`;

//Delete a review
const SQL_deleteReview = () => `DELETE FROM review WHERE id = ?`;

//Delete comments from a review
const SQL_deleteComments = () => `DELETE FROM comment WHERE review_id = ?`;

//Edit a review
const SQL_editReview = () => `UPDATE review SET ? WHERE id = ?`;

model.getReviewsByFilm = film_id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_findReviewsByFilm(), [film_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.getReviewsByUser = user_id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_findReviewsByUser(), [user_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.getReviewById = id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_findReviewById(), [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.getAllReviews = () => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_findAllReviews(), (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.addReview = data => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_addReview(), [data], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.checkifUserReviewed = (user_id, film_id) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      SQL_checkIfUserReviewed(),
      [user_id, film_id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

model.deleteReview = id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_deleteReview(), [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.deleteReviewComments = review_id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_deleteComments(), [review_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.editReview = (reviewObj, id) => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_editReview(), [reviewObj, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.reviewsAverage = films => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_reviews_avg(films), (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = model;
