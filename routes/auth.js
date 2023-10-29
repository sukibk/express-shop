const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// Get routes
router.get('/login')
router.get('/register');

// Post routes
router.post('register')
router.post('/login')

module.exports = router;