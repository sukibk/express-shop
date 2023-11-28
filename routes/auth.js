const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const authController = require('../controllers/auth');

// Get routes
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);

// Post routes
router.post('/login', authController.postLogin);
router.post('/register', check('email').isEmail().withMessage('Please enter a valid email') , authController.postRegister);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;