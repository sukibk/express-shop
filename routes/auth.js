const express = require('express');
const router = express.Router();
const { registerValidator, loginValidator } = require('../utils/validators');


const authController = require('../controllers/auth');
const User = require('../models/user');

// Get routes
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);

// Post routes
router.post('/login', loginValidator, authController.postLogin);
router.post('/register', registerValidator, authController.postRegister);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;