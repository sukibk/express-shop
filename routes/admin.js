const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/is-auth')

// Add Product Page
router.get('/add-product', isAuthenticated, adminController.getAddProduct);
router.post('/add-product', isAuthenticated, adminController.postAddProduct);

// Admin Products Page
router.get('/products', isAuthenticated, adminController.getAdminProducts);
// - Delete Option
router.post('/delete-product', isAuthenticated, adminController.postDeleteProduct);

// Admin Edit Product Page
router.get('/edit-product/:productId', isAuthenticated, adminController.getEditProduct);
router.post('/edit-product', isAuthenticated, adminController.postEditProduct);


module.exports = router;