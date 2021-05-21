import { Product } from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add a Product",
    path: "/admin/add-product",
    editing: false,
  });
};

export const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, price, description, imageUrl);

  product
    .save()
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};

export const postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const updatedProduct = new Product(title, price, description, imageUrl, id);

  updatedProduct
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
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
      });
    })
    .catch((err) => console.log(err));
};

export const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        path: "/admin/products",
        pageTitle: "Admin Products",
      });
    })
    .catch((err) => console.log(err));
};

export const postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;

  Product.deleteById(id)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
