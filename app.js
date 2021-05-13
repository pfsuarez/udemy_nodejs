// const express = require("express");
import express from "express";
import bodyParser from "body-parser";
import path from "path";

//template engine
import expressHbs from "express-handlebars";

import { __dirname } from "./helper/helper.js";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";

const app = express();

app.engine("hbs", expressHbs({
  layoutsDir: "views/layouts/", // <- it's only necessary if you put the layout in another location
  defaultLayout: "main-layout",
  extname: "hbs"
})); // <- the way to use handlebars template engine .hbs
app.set("view engine", "hbs"); // <- the way to use handlebars template engine. View filename extension must be .hbs

//app.set("view engine", "pug"); // <- the way to use Pug template engine
app.set("views", "views"); // <- not necessary, by default templates must be in views folder

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));

  //pug
  //res.status(404).render("404", { docTitle: "Page Not Found" });

  //handlebars
  res.status(404).render("404", { 
    docTitle: "Page Not Found", 
    //layout: false 
  });
});

app.listen(3000);
