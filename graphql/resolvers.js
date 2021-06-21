import bcrypt from "bcryptjs";

import { getCustomError } from "../helper/error.js";
import User from "../models/user.js";

export default {
  createUser: async function ({ userInput }, req) {
    const { email, password, name } = userInput;
    const userDb = await User.findOne({ email });

    if(userDb) {
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
      _id: createdUser._id.toString()
    };
  },
};
