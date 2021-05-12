import express from "express";
import path from "path";

import { __dirname } from "../helper/helper.js";

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  return res.sendFile(path.join(__dirname, "views", "add-product.html"));
});

// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  console.log("", req.body);
  res.redirect("/");
});

export default router;