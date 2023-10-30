const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop')

const isAuthenticated = require('../middleware/is-auth')

// Products Page
router.get('/products', shopController.getProducts);

// Single Product Page
router.get('/products/:productId', shopController.getProduct);

// Cart Page
router.get('/cart', isAuthenticated, shopController.getCart);
router.post('/cart', isAuthenticated, shopController.postCart);
router.post('/cart-delete-item', isAuthenticated, shopController.postDeleteCartItem)

// Orders Page
router.get('/orders', isAuthenticated, shopController.getOrders);
router.post('/orders', isAuthenticated, shopController.postOrders);

// Index Page
router.get('/', shopController.getIndex);

module.exports = router;