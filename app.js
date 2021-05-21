import express from "express";
import bodyParser from "body-parser";
import path from "path";

import { __dirname } from "./helper/helper.js";
import { mongoConnect } from "./helper/database.js";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";

import { get404Page } from "./controllers/error.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // <- not necessary, by default templates must be in views folder

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404Page);

mongoConnect().then(() => {
  app.listen(3000);
});
