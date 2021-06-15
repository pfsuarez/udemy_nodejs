import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { jwtSecret } from "../helper/configuration.js";
import { getCustomError } from "../helper/error.js";
import User from "../models/user.js";

export const signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = getCustomError("Validation failed.", 422, null);
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();
    
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (error) {
    next(getCustomError(null, null, error));
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = getCustomError("Validation failed.", 422, null);
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const userDb = await User.findOne({ email });
    if (!userDb) {
      throw getCustomError("User not found", 401, null);
    }

    const isPasswordEqual = await bcrypt.compare(password, userDb.password);
    if (!isPasswordEqual) {
      throw getCustomError("Wrong password", 401, null);
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

    res.status(200).json({ token, userId: userDb._id.toString() });

  } catch (error) {
    next(getCustomError(null, null, error));
  }
};
