import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

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
    console.log("REQ", req);
    const errors = [];
    const { title, content, imageUrl } = postInput;
    const userId = req.userId;

    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push("Title is invalid.");
    }
    if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
      errors.push("Content is invalid.");
    }
    if (errors.length > 0) {
      const error = getCustomError("Invalid input", 400);
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const post = new Post({
      title,
      content,
      imageUrl,
      //creator: userId,
    });

    const createdPost = await post.save();
    // TODO Add post to Users' posts
    return {
      ...createPost._doc,
      _id: createPost._id.toString(),
      createdAt: createPost.createdAt.toISOString(),
      updatedAt: createPost.updatedAt.toISOString(),
    };
  },
};
