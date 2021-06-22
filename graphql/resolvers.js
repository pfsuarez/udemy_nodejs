import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

import { clearImage } from "../helper/util.js";
import { getCustomError } from "../helper/error.js";
import { jwtSecret } from "../helper/configuration.js";

import User from "../models/user.js";
import Post from "../models/post.js";
import { createPost } from "../controller/feed.js";

export default {
  createUser: async function ({ userInput }, req) {
    const { email, password, name } = userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "Email is invalid" });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password too short" });
    }
    if (errors.length > 0) {
      const error = getCustomError("Invalid input", 400);
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const userDb = await User.findOne({ email });

    if (userDb) {
      throw getCustomError("User exists already", 500, null);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    const createdUser = await user.save();

    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
    };
  },
  login: async function ({ email, password }) {
    const userDb = await User.findOne({ email });
    if (!userDb) {
      const error = getCustomError("User not found", 401, null);
      error.code = 401;
      throw error;
    }

    const isPasswordEqual = await bcrypt.compare(password, userDb.password);
    if (!isPasswordEqual) {
      const error = getCustomError("Wrong password", 401, null);
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: userDb.email,
        userId: userDb._id.toString(),
      },
      jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    return {
      token,
      userId: userDb._id.toString(),
    };
  },
  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      const error = getCustomError("Not Authenticated", 401);
      error.code = 401;
      throw error;
    }
    const errors = [];
    const { title, content, imageUrl } = postInput;
    const userId = req.userId;

    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push("Title is invalid.");
    }
    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push("Content is invalid.");
    }
    if (errors.length > 0) {
      throw getCustomError("Invalid input", 422);
    }

    const userDb = await User.findById(userId);
    if (!userDb) {
      const error = getCustomError("Invalid User");
      error.code = 401;
      throw error;
    }

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: userDb,
    });

    const createdPost = await post.save();
    userDb.posts.push(createdPost);
    await userDb.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  posts: async function ({ page }, req) {
    if (!req.isAuth) {
      const error = getCustomError("Not Authenticated", 401);
      error.code = 401;
      throw error;
    }

    const currentPage = page || 1;
    const perPage = 2;

    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return {
      posts: posts.map((post) => {
        return {
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        };
      }),
      totalPosts,
    };
  },
  post: async function ({ id }, req) {
    if (!req.isAuth) {
      throw getCustomError("Not Authenticated", 401);
    }

    const post = await Post.findById(id).populate("creator");
    if (!post) {
      throw getCustomError("Post not found", 404);
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
  updatePost: async function ({ id, postInput }, req) {
    if (!req.isAuth) {
      throw getCustomError("Not Authenticated", 401);
    }

    const postDb = await Post.findById(id).populate("creator");
    if (!postDb) {
      throw getCustomError("Post not found", 404);
    }

    if (postDb.creator._id.toString() !== req.userId.toString()) {
      throw getCustomError("Not authorized", 403);
    }

    const errors = [];
    const { title, content, imageUrl } = postInput;
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push("Title is invalid.");
    }
    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push("Content is invalid.");
    }
    if (errors.length > 0) {
      throw getCustomError("Invalid input", 422);
    }

    postDb.title = postInput.title;
    postDb.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      postDb.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await postDb.save();

    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },
  deletePost: async function ({ id }, req) {
    if (!req.isAuth) {
      throw getCustomError("Not Authenticated", 401);
    }

    const postDb = await Post.findById(id);
    if (!postDb) {
      throw getCustomError("Post not found", 404);
    }

    if (postDb.creator._id.toString() !== req.userId.toString()) {
      throw getCustomError("Not authorized", 403);
    }

    const userDb = await User.findById(req.userId);

    if (!userDb) {
      throw getCustomError("User not found", 404);
    }

    clearImage(postDb.imageUrl);
    userDb.posts.pull(id);
    await userDb.save();
    await Post.findByIdAndRemove(id);
    return true;
  },
  user: async function (args, req) {
    if (!req.isAuth) {
      throw getCustomError("Not Authenticated", 401);
    }

    const userDb = await User.findById(req.userId);

    if (!userDb) {
      throw getCustomError("User not found", 404);
    }

    return {
      ...userDb._doc,
      _id: userDb._id.toString(),
    };
  },
  updateStatus: async function ({status}, req) {
    if (!req.isAuth) {
      throw getCustomError("Not Authenticated", 401);
    }

    const userDb = await User.findById(req.userId);

    if (!userDb) {
      throw getCustomError("User not found", 404);
    }

    userDb.status = status;
    const savedUser = await userDb.save();

    return {
      ...savedUser._doc,
      _id: savedUser._id.toString(),
    };
  }
};
