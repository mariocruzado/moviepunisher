const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');

//Get All reviews
router.get('/', reviewController.getAllReviews);

//Get A specified review
router.get('/:id', reviewController.getReviewById);

//Get All reviews by film
router.get('/film/:id', reviewController.getReviewsByFilm);

//Get All reviews by user
router.get('/user/:id', reviewController.getReviewsByUser);

//Add new review
router.post('/:filmid', reviewController.addReview);

//Delete a review
router.delete('/:id', reviewController.deleteReview);

//Edit a review
router.put('/:id', reviewController.editReview);

//Get average rating and number of reviews from a film
router.post('/film/avg', reviewController.getReviewsAndAverage);

module.exports = router;