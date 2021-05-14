import express from "express";
import bodyParser from "body-parser";
import path from "path";

import { __dirname } from "./helper/helper.js";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";

const app = express();

//ejs
app.set("view engine", "ejs");

app.set("views", "views"); // <- not necessary, by default templates must be in views folder

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { 
    pageTitle: "Page Not Found"
  });
});

app.listen(3000);
