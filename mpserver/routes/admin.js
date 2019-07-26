const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

//Create User
router.post('/new', adminController.newUser);

//Get Users list
router.get('/list', adminController.listUsers);

//Edit User
router.put('/edit/:id', adminController.editUser);

//Delete User
router.delete('/delete/:id', userController.deleteUser);

//Get User Details
router.get('/details/:id', adminController.getUserById);

module.exports = router;

