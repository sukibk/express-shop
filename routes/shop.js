const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop')

const isAuthenticated = require('../middleware/is-auth')

router.get('/', shopController.getIndex);

module.exports = router;