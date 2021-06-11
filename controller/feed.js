import { validationResult } from "express-validator";
import { getCustomError } from "../helper/error.js";

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
    throw getCustomError("Validation failed. Entered data is incorrect.", 422, null);
  }

  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title,
    content,
    imageUrl: "images/107-rafita.jpg",
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
