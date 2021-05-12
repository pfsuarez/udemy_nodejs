import express from "express";
import path from "path";

import { __dirname } from "../helper/helper.js";

import { products } from "./admin.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  //return res.sendFile(path.join(__dirname, "views" , "shop.html"));
  res.render("shop", { prods: products, docTitle: "Shop", path: "/" });
});

export default router;
