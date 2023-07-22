/**
 * Route to handle the User management.
 */
const express = require('express');
const userController = require('../controllers/user.controller');
const authenticator = require('../middlewares/auth.mw');
require('dotenv').config();


const router = express.Router(); 

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', authenticator, userController.logoutUser);
router.put('/change_password', authenticator, userController.changePassword);

module.exports = router;