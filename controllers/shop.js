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
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((products) => {
      console.log("GetCart", products);
      res.render("shop/cart", {
        products: products,
        path: "cart",
        pageTitle: "Your Cart",
      });
    });
};

export const postCart = (req, res, next) => {
  const prodId = +req.body.productId;
  let fetchedCart;
  let qty;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({
        where: {
          id: prodId,
        },
      });
    })
    .then((products) => {
      let product;
      qty = 1;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQty = product.cartItem.qty;
        qty = oldQty + 1;
      }

      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: {
          qty: qty,
        },
      });
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

export const postCartDeleteItem = (req, res, next) => {
  const productId = +req.body.productId;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => res.redirect("/cart"));
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
