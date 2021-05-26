import { Product } from "../models/product.js";

export const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log("PRODUCTS", products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

export const getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId).then((product) => {
    console.log("PRODUCT", product);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: "Product Detail",
      path: "/product-detail",
    });
  });
};

export const getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        path: "/",
        pageTitle: "Shop",
      });
    })
    .catch((err) => console.log(err));
};

export const getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    res.render("shop/cart", {
      products: products,
      path: "cart",
      pageTitle: "Your Cart",
    });
  });
};

export const postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

export const postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .deleteItemFromCart(productId)
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

export const getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log("orders", orders);
      res.render("shop/orders", {
        path: "orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => console.log(err));
};

export const postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};
