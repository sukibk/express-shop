const Product = require("../models/product");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// Add Product Page
// On GET
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
  });
};
// On POST
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/products",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  const newProduct = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });

  newProduct
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Admin Products Page
// On GET
exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Admin Edit Product Page
// On GET
exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editing = req.query.edit;

  if (!editing) res.redirect("/");

  Product.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit" + product.title,
        product: product,
        path: "/admin/products",
        editing: editing,
        hasError: false,
        errorMessage: null,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// On POST
exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;

  const prodId = req.body.productId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit" + title,
      path: "/admin/products/",
      editing: true,
      hasError: true,
      product: {
        _id: prodId,
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  Product.findById(prodId)
    .then((prod) => {
      if (prod.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      prod.title = title;
      prod.price = price;
      prod.description = description;
      prod.imageUrl = imageUrl;

      return prod.save().then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Admin Product Delete on POST
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
