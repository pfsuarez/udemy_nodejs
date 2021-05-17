import { Product } from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add a Product",
    path: "/admin/add-product",
  });
};

export const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if(!editMode) {
    return res.redirect("/");
  }

  res.render("admin/edit-product", {
    pageTitle: "Edit a Product",
    path: "/admin/edit-product",
    editing: editMode
  });
};

export const getProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render("admin/products", {
      prods: products,
      path: "/admin/products",
      pageTitle: "Admin Products",
    });
  });
};
