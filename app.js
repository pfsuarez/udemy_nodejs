import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";

import mongoose from "mongoose";
import connectMongodbSession from "connect-mongodb-session";

import csrf from "csurf";
import flash from "connect-flash";

import { __dirname } from "./helper/helper.js";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";

import * as errors from "./controllers/error.js";

import { User } from "./models/user.js";

const password = "";
const MONGODB_URI = `mongodb+srv://picateclas:${password}@cluster0.rsjvy.mongodb.net/shop?retryWrites=true&w=majority`;

const csrfProtection = csrf({});

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // <- not necessary, by default templates must be in views folder

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

const mongoDbStore = connectMongodbSession(session);
const store = new mongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
app.use(
  session({
    secret: "asdfghjkl",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errors.get500Page)

app.use(errors.get404Page);

app.use((error, req, res, next) => {
  return res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
