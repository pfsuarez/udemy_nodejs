import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import { v4 as uuidV4 } from "uuid";

import { graphqlHTTP } from "express-graphql";

import * as configuration from "./helper/configuration.js";
import { __dirname } from "./helper/path.js";
import { clearImage } from "./helper/util.js";

import graphqlSchema from "./graphql/schema.js";
import graphqlResolvers from "./graphql/resolvers.js";

import auth from "./middleware/auth.js";

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

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    const error = getCustomError("Not Authenticated", 401);
    error.code = 401;
    throw error;
  }

  if (!req.file) {
    return res.status(200).json({ message: "No file provided" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }

  return res
    .status(201)
    .json({ message: "File stored", filePath: req.file.path });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn: (err) => {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return {
        message,
        status: code,
        data,
      };
    },
  })
);

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
    app.listen(8080);
  })
  .catch((err) => console.log("MongoDb Error", err));