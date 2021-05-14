import { Product } from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
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
  Product.fetchAll().then((products) =>
    res.render("shop/product-list", { prods: products, pageTitle: "Shop", path: "/" })
  );
};
