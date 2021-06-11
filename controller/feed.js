import fs from "fs";
import path from "path";

import { validationResult } from "express-validator";
import { getCustomError } from "../helper/error.js";
import { __dirname } from "../helper/path.js";

import Post from "../models/post.js";

export const getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      return res.status(200).json({ posts });
    })
    .catch((err) => {
      next(getCustomError(null, null, err));
    });
};

export const createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw getCustomError(
      "Validation failed. Entered data is incorrect.",
      422,
      null
    );
  }

  if (!req.file) {
    throw getCustomError("No image provided.", 422, null);
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: {
      name: "QWERTY",
    },
  });

  post
    .save()
    .then((postResult) => {
      res.status(201).json({
        message: "Post created succesfully",
        post: postResult,
      });
    })
    .catch((err) => {
      next(getCustomError(null, null, err));
    });
};

export const getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        throw getCustomError("Post could not found.", 404, null);
      }

      return res.status(200).json({ post });
    })
    .catch((err) => {
      next(getCustomError(null, null, err));
    });
};

export const updatePost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw getCustomError(
      "Validation failed. Entered data is incorrect.",
      422,
      null
    );
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    throw getCustomError("No file picked", 422, null);
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        throw getCustomError("Post Not Found", 404, null);
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      return post.save();
    })
    .then((post) => {
      res.status(200).json({ post });
    })
    .catch((err) => {
      next(getCustomError(null, null, err));
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, filePath);
  fs.unlink(filePath, (err) => console.log("ERROR DELETING FILE", err));
};
