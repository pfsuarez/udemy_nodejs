import express from "express";
import bodyParser from "body-parser";
import path from "path";

import mongoose from "mongoose";

import { __dirname } from "./helper/helper.js";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";

import { get404Page } from "./controllers/error.js";

//import { User } from "./models/user.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // <- not necessary, by default templates must be in views folder

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

//app.use((req, res, next) => {
  // const userId = "60a78efc230d7d0aa7545377";
  // User.findById(userId)
  //   .then((user) => {
  //     req.user = new User(user.name, user.email, user.cart, user._id);
  //     next();
  //   })
  //   .catch((err) => console.log(err));
//});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404Page);

const password = "";

mongoose
  .connect(
    `mongodb+srv://picateclas:${password}@cluster0.rsjvy.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
