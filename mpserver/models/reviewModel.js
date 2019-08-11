const dbConn = require("../config/db");

const model = {};

//Check if user has written a review about a film
const SQL_checkIfUserReviewed = () =>
  `SELECT id FROM review WHERE user_id = ? AND film_id = ?`;

//Get a detailed Review
const SQL_findReviewById = () => `SELECT review.id, review.film_id, review.user_id, review.title, review.content, review.rating, review.date, review.modifiedby, u1.username AS user_username, u1.isadmin AS user_isadmin, profile.name AS profile_name, profile.avatar AS profile_avatar, u2.username AS modifiedby_username
FROM review
INNER JOIN user AS u1 ON u1.id = review.user_id 
INNER JOIN profile ON profile.id = u1.profile_id
LEFT JOIN user AS u2 ON u2.id = review.modifiedby
WHERE review.id = ?`;

//Get all reviews by film ID
const SQL_findReviewsByFilm = () => `SELECT review.id, review.film_id, review.user_id, review.title, review.content, review.rating, review.date, review.modifiedby, u1.username AS user_username, u1.isadmin AS user_isadmin, profile.name AS profile_name, profile.avatar AS profile_avatar, u2.username AS modifiedby_username
FROM review
INNER JOIN user AS u1 ON u1.id = review.user_id 
INNER JOIN profile ON profile.id = u1.profile_id
LEFT JOIN user AS u2 ON u2.id = review.modifiedby
WHERE review.film_id = ? ORDER BY review.date DESC`;

//Get all reviews by user ID
const SQL_findReviewsByUser = () => `SELECT review.id, review.film_id, review.user_id, review.title, review.content, review.rating, review.date, review.modifiedby, user.username AS user_username, user.isadmin AS user_isadmin, profile.name AS profile_name, profile.avatar AS profile_avatar, localfilm.original_title AS film_title, localfilm.poster_path AS film_cover
FROM review
INNER JOIN user ON user.id = review.user_id 
INNER JOIN profile ON profile.id = user.profile_id
INNER JOIN localfilm ON localfilm.id = review.film_id
WHERE review.user_id = ? ORDER BY review.date DESC`;

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
