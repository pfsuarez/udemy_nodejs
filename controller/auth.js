import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { jwtSecret } from "../helper/configuration.js";
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
        password: hashedPassword,
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

export const login = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = getCustomError("Validation failed.", 422, null);
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  let userDb;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw getCustomError("User not found", 401, null);
      }

      userDb = user;

      return bcrypt.compare(password, user.password);
    })
    .then((isPasswordEqual) => {
      if (!isPasswordEqual) {
        throw getCustomError("Wrong password", 401, null);
      }

      const token = jwt.sign(
        {
          email: userDb.email,
          id: userDb._id.toString(),
        },
        jwtSecret,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ token, userId: userDb._id.toString() });
    })
    .catch((err) => {
      next(getCustomError(null, null, err));
    });
};
