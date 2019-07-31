const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

//New User
router.post('/register', userController.register);

//Edit User
router.put('/:id', userController.edit);

//User Details
router.get('/:id', userController.getById);

//All Users
router.get('/', userController.getAll);

//Delete User
router.delete('/:id', userController.deleteUser);

//Get profiles
router.get('/all/profiles', userController.getProfiles);

module.exports = router;