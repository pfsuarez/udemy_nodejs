import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import { getCustomError } from "../helper/error.js";
import User from "../models/user.js";

export const signUp = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = getCustomError("Validation failed.", 422, null);
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword.length,
        name,
      });

      return user.save();
    })
    .then((user) => {
      res.status(201).json({ message: "User created", userId: user._id });
    })
    .catch((err) => {
      next(getCustomError(null, null, err));
    });
};

export const getPosts = (req, res, next) => {};
