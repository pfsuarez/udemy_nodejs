import { Product } from "../models/product.js";

export const getProducts = (req, res, next) => {
  Product.fetchAll()
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

  console.log("GET PRODUCT", productId);

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
  Product.fetchAll()
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
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => console.log(err));
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

export const postOrder = (req, res, next) => {
  let fetchedCart;
  let fetchedProducts;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      fetchedProducts = products;
      return req.user.createOrder();
    })
    .then((order) => {
      return order.addProducts(
        fetchedProducts.map((product) => {
          product.orderItem = {
            qty: product.cartItem.qty,
          };
          return product;
        })
      );
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};
