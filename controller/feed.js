import fs from "fs";
import path from "path";

import { validationResult } from "express-validator";
import { getCustomError } from "../helper/error.js";
import { __dirname } from "../helper/path.js";

import Post from "../models/post.js";
import User from "../models/user.js";

export const getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .populate('creator')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ posts, totalItems });
  } catch (err) {
    next(getCustomError(null, null, err));
  }
};

export const createPost = async (req, res, next) => {
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
  const userId = req.userId;

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: userId,
  });

  try {
    await post.save();
    const userDb = await User.findById(userId);

    userDb.posts.push(post);
    await userDb.save();

    res.status(201).json({
      message: "Post created succesfully",
      post: post,
      creator: {
        id: userDb._id.toString(),
        name: userDb.name,
      },
    });
  } catch (error) {
    next(getCustomError(null, null, error));
  }
};

export const getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId).populate('creator');

    if (!post) {
      throw getCustomError("Post could not found.", 404, null);
    }

    return res.status(200).json({ post });
  } catch (error) {
    next(getCustomError(null, null, error));
  }
};

export const deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw getCustomError("Post could not found.", 404, null);
    }

    if (post.creator.toString() !== userId.toString()) {
      throw getCustomError("Not Authorized", 403, null);
    }

    clearImage(post.imageUrl);

    await Post.findByIdAndRemove(postId);

    const userDb = await User.findById(userId);
    userDb.posts.pull(postId);
    await userDb.save();

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    next(getCustomError(null, null, error));
  }
};

export const updatePost = async (req, res, next) => {
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
  const userId = req.userId;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    throw getCustomError("No file picked", 422, null);
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw getCustomError("Post Not Found", 404, null);
    }

    if (post.creator.toString() !== userId.toString()) {
      throw getCustomError("Not Authorized", 403, null);
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    await post.save();

    res.status(200).json({ post });
  } catch (error) {
    next(getCustomError(null, null, error));
  }
};

export const getStatus = async (req, res, next) => {
  const userId = req.userId;

  try {
    const userDb = await User.findById(userId);

    if (!userDb) {
      throw getCustomError("User not found", 404, null);
    }
    res.status(200).json({ status: userDb.status });
  } catch (error) {
    next(getCustomError(null, null, error));
  }
};

export const updateStatus = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw getCustomError(
      "Validation failed. Entered data is incorrect.",
      422,
      null
    );
  }
  const userId = req.userId;
  const status = req.body.status;

  try {
    const userDb = await User.findById(userId);
    if (!userDb) {
      throw getCustomError("User not found", 404, null);
    }

    userDb.status = status;
    await userDb.save();

    res.status(201).json({ message: "Status updated" });
  } catch (error) {
    next(getCustomError(null, null, error));
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, filePath);
  fs.unlink(filePath, (err) => console.log("ERROR DELETING FILE", err));
};
