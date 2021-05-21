import express from "express";

import * as adminController from "../controllers/admin.js";

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// /admin/product => GET
router.get("/products", adminController.getProducts);

//Routers (get/post) to edit a product
router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

//Delete Product
router.post("/delete-product", adminController.postDeleteProduct);

export default router;