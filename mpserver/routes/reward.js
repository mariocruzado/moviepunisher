const express = require('express');
const router = express.Router();

const rewardController = require('../controllers/rewardController');

//Get prizes by user id
router.get('/:id', rewardController.getPrizesByUser);

module.exports = router;