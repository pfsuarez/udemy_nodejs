import express from "express";
import path from "path";

import { __dirname } from "../helper/helper.js";

const router = express.Router();

export const products = [];

// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  res.render("add-product", { pageTitle: "Add a Product", path: "/admin/add-product"});
});

// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

export default router;
