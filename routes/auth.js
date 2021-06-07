import express from "express";
import { check, body } from "express-validator/check/index.js";

import * as authController from "../controllers/auth.js";
import { User } from "../models/user.js";

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    check("email", "Please enter a valid email.")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({
          email: value,
        }).then((user) => {
          if (!user) {
            return Promise.reject("Invalid email or password!");
          }
        });
      }),
    check("password", "Password must be at least 5 characters long.")
      .isAlphanumeric()
      .isLength({ min: 5 }),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        //Custom Validation
        // if (value === "pepe0@test.com") {
        //   throw new Error("This email address is forbidden.");
        // }
        //return true;

        //Async Validation
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email currently in use!");
          }
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

export default router;
