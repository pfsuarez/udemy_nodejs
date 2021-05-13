import express from "express";
import path from "path";

import { __dirname } from "../helper/helper.js";

const router = express.Router();

export const products = [];

// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  //return res.sendFile(path.join(__dirname, "views", "add-product.html"));

  //pug
  //res.render("add-product", { pageTitle: "Add a Product", path: "/admin/add-product"});

  //handlebars
  res.render("add-product", {
    pageTitle: "Add a Product",
    //layout: false,
    activeAddProduct: true,
    productCss: true,
    formsCss: true,
  });
});

// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

export default router;
