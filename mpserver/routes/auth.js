const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

//Default API welcome msg
router.get('/', authController.welcome);

//Login (authentication & token signing)
router.post('/', authController.login);

module.exports = router;