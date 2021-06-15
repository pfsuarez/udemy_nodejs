import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import { v4 as uuidV4 } from "uuid";
import { Socket, Server } from "socket.io";

import * as configuration from "./helper/configuration.js";
import { __dirname } from "./helper/path.js";

import feedRoutes from "./routes/feed.js";
import authRoutes from "./routes/auth.js";

import { setIO, getIO } from "./socket.js";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidV4()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//app.use(bodyParser.urlencoded()); //x-www-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({
    storage: fileStorage,
    fileFilter,
  }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // domain.com
  res.setHeader("Access-Control-Allow-Methods", "*"); // GET, POST, PUT, PATCH, DELETE
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(statusCode).json({
    message,
    data,
  });
});

mongoose
  .connect(configuration.MONGODB_URI)
  .then(() => {
    console.log("MongoDb Connected");

    const server = app.listen(8080);
    setIO(server);

    getIO().on("connection", (socket) => {
      console.log("CLIENT CONNECTED");
    });
  })
  .catch((err) => console.log("MongoDb Error", err));
