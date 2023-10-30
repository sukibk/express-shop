const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/is-auth')

// Add Product Page
router.get('/add-product', isAuthenticated, adminController.getAddProduct);
router.post('/add-product', isAuthenticated, adminController.postAddProduct)

// Admin Products Page
router.get('/products', isAuthenticated, adminController.getAdminProducts);

module.exports = router;