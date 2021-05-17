import { Product } from "../models/product.js";

export const getProducts = (req, res, next) => {
  Product.fetchAll().then((products) =>
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    })
  );
};

export const getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId).then((product) => {
    res.render("shop/product-detail", {
      product,
      pageTitle: "Product Detail",
      path: "/product-detail"
    });
  });
};

export const getIndex = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render("shop/index", {
      prods: products,
      path: "/",
      pageTitle: "Shop",
    });
  });
};

export const getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "cart",
    pageTitle: "Your Cart",
  });
};

export const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log("PRODUCT CART", prodId);
  res.redirect("/cart");
}

export const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "orders",
    pageTitle: "Your Orders",
  });
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
