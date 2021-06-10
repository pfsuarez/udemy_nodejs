import express from "express";
import bodyParser from "body-parser";

import feedRoutes from "./routes/feed.js";

const app = express();

//app.use(bodyParser.urlencoded()); //x-www-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // domain.com
  res.setHeader("Access-Control-Allow-Methods", "*"); // GET, POST, PUT, PATCH, DELETE
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //
  next();
});

app.use("/feed", feedRoutes);

app.listen(8080);
