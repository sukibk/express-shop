const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// Get routes
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/reset', authController.getReset);

// Post routes
router.post('/login', authController.postLogin);
router.post('/register', authController.postRegister);
router.post('/logout', authController.postLogout);

module.exports = router;