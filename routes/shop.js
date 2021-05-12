import express from "express";
import path from "path";

import { __dirname } from "../helper/helper.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  return res.sendFile(path.join(__dirname, "views" , "shop.html"));
});

export default router;