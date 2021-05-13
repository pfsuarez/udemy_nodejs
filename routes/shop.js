import express from "express";
import path from "path";

import { __dirname } from "../helper/helper.js";

import { products } from "./admin.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  //return res.sendFile(path.join(__dirname, "views" , "shop.html"));

  //pug & ejs
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/"});

  //handlebars
  // res.render("shop", {
  //   prods: products,
  //   pageTitle: "Shop",
  //   //layout: false,
  //   hasProducts: products.length > 0,
  //   activeShop: true,
  //   productCss: true
  // });
});

export default router;
