import { validationResult } from "express-validator/check/index.js";

import { Product } from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add a Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: null,
    validationErrors: [],
    hasError: false,
  });
};

export const postAddProduct = (req, res, next) => {
  console.log("--------------------------------------------");
  console.log(req.file);

  const title = req.body.title.trim();
  const imageUrl = "";
  const description = req.body.description.trim();
  const price = req.body.price;
  const userId = req.user._id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add a Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
    });
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user, //passing entire user object, mongoose will map user _id
  });

  product
    .save()
    .then(() => res.redirect("/"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const postEditProduct = (req, res, next) => {
  console.log("--------------------------------------------");
  console.log(req.file);

  const id = req.body.productId;
  const title = req.body.title.trim();
  const imageUrl = req.body.image;
  const description = req.body.description.trim();
  const price = req.body.price;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
        _id: id,
      },
    });
  }

  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save().then(() => res.redirect("/admin/products"));
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit a Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        errorMessage: null,
        validationErrors: [],
        hasError: false,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id") //specify fields names. using - exclude that field
    // .populate("userId", "name") // get the fields from the relationship. Second param specify wich fields
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        path: "/admin/products",
        pageTitle: "Admin Products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
