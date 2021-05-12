// const express = require("express");
import express from "express";
import bodyParser from "body-parser";
import path from "path";

import { __dirname } from "./helper/helper.js";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";


const app = express();

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
