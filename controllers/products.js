import { Product } from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add a Product",
    path: "/admin/add-product",
  });
};

export const postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

export const getProducts = (req, res, next) => {
  res.render("shop", { prods: Product.fetchAll(), pageTitle: "Shop", path: "/" });
};
