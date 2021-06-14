import { validationResult } from "express-validator";
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
};

export const getPosts = (req, res, next) => {};
