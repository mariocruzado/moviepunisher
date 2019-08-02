const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');

router.get('/:id', commentController.getCommentById);

router.get('/review/:reviewid', commentController.byReviewId);

router.get('/user/:userid', commentController.byUserId);

router.delete('/:id', commentController.delete);

router.post('/new/:reviewid', commentController.add);

module.exports = router;