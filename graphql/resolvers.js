import bcrypt from "bcryptjs";
import validator from "validator";

import { getCustomError } from "../helper/error.js";
import User from "../models/user.js";

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
};
