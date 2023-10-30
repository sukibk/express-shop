const Product = require('../models/product');
const User =  require('../models/user')

// Index Page on GET
exports.getIndex = (req, res, next) => {
    Product.find({})
        .then(products => {
            res.render('shop/index',{
                pageTitle: 'Online Store',
                path: '/',
                prods: products
            })
        })
        .catch(err => {
            console.log(err)
        })

}

// Products Page on GET
exports.getProducts = (req, res, next) => {
    Product.find({})
        .then(products => {
            res.render('shop/products',{
                pageTitle: 'Products',
                path: '/products',
                prods: products
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// Single Product Page on GET
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(prod => {
            res.render('shop/single-product',{
                pageTitle: 'Products',
                path: '/products',
                product: prod
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// Cart Page
// On Get
exports.getCart = (req, res, next) => {
    User.findById(req.user._id)
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                pageTitle: req.user.email + "'s Cart",
                products: products,
                path: '/cart'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// On Post
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
        console.log(err)
    })
}

// Orders Page
// On GET
exports.getOrders = (req, res, next) => {

    res.render('shop/cart',{
        pageTitle: req.user.email + ' Cart',
        path: '/cart',
        products: []
    })
}

// On POST
exports.postOrders = (req, res, next) => {

}

// Delete Cart Item on POST
exports.postDeleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;

    req.user.deleteItem(prodId)
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err)
        })
}