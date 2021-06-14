import express from "express";
import { body } from "express-validator";

import * as authController from "../controller/auth.js";
import User from "../models/user.js";

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("name").trim().notEmpty(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signUp
);

export default router;
