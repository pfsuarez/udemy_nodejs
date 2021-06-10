import fs from "fs";
import path from "path";

import PDFDocument from "pdfkit";

import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

const ITEMS_PER_PAGE = 1;

export const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId).then((product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: "Product Detail",
      path: "/product-detail",
    });
  });
};

export const getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProducts;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        path: "/",
        pageTitle: "Shop",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      console.log("PRODUCTS", products);
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .removeFromCart(productId)
    .then(() => res.redirect("/cart"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          qty: i.qty,
          product: { ...i.productId._doc },
        };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products,
      });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect("/orders"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("data", "invoices", invoiceName);

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No Order found."));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized."));
      }

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${invoiceName}"`
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", { underline: true });
      pdfDoc.text("-----------------------------------------");

      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.qty * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(`${prod.product.title} (${prod.qty} x $${prod.product.price})`);
      });

      pdfDoc.text("------");
      pdfDoc.fontSize(20).text(`Total Price $${totalPrice}`);

      pdfDoc.end();

      //Used for small files
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     `attachment; filename="${invoiceName}"`
      //   );
      //   res.send(data);
      // });

      //Streaming file
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   `attachment; filename="${invoiceName}"`
      // );
      // file.pipe(res);
    })
    .catch((err) => next(err));
};
