import { Product } from "../models/product.js";
import { Cart } from "../models/cart.js";

export const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
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

  // Product.findAll({
  //   where: {
  //     id: productId,
  //   },
  // }).then((products) => {
  //   res.render("shop/product-detail", {
  //     product: products[0],
  //     pageTitle: products[0].title,
  //     path: "/product-detail",
  //   });
  // });

  Product.findByPk(productId).then((product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: "Product Detail",
      path: "/product-detail",
    });
  });
};

export const getIndex = (req, res, next) => {
  Product.findAll()
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
  Cart.getCart().then((cart) => {
    Product.fetchAll().then((products) => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }

      res.render("shop/cart", {
        products: cartProducts,
        path: "cart",
        pageTitle: "Your Cart",
      });
    });
  });
};

export const postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId).then((product) => {
    Cart.addProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

export const postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId).then((product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
};

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
