// const express = require("express");
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded());

// app.use("/users", (req, res, next) => {
//   res.send("<h1>Users Page</h1>")
// });

// app.use("/", (req, res, next) => {
//   res.send("<h1>Home Page</h1>")
// });

// app.listen(3000);

app.use("/add-product", (req, res, next) => {
  return res.send(`<form action="/product" method="POST">
    <input type="text" name="title">
    <button type="submit">Add Product</button>
  </form>`)
});

app.post("/product", (req, res, next) => {
  console.log("", req.body);
  res.redirect("/");
});

app.use("/", (req, res, next) => {
  
  return res.send("<h1>Hello from express.js</h1>")
});

app.listen(3000);
