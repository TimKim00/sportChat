/**
 * Route to handle the User management.
 */
const express = require('express');
const userController = require('../controllers/user.controller');
const authenticator = require('../middlewares/auth.mw');
require('dotenv').config();

// const router = express.Router();

// router.get('/', authenticator, userController.getUser);
// router.put('/', authenticator, userController.updateUser);