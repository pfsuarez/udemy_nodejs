import express from "express";
import { check } from "express-validator/check/index.js";

import * as adminController from "../controllers/admin.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    check("title").trim().isString().isLength({ min: 3 }),
    check("price").isCurrency(),
    check("description").trim().isLength({ min: 5 }),
  ],
  isAuth,
  adminController.postAddProduct
);

// /admin/product => GET
router.get("/products", isAuth, adminController.getProducts);

//Routers (get/post) to edit a product
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    check("title").trim().isString().isLength({ min: 3 }),
    check("price").isCurrency(),
    check("description").trim().isLength({ min: 5 }),
  ],
  isAuth,
  adminController.postEditProduct
);

//Delete Product
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

export default router;
