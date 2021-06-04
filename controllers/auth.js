import bcrypt from "bcryptjs";
import { User } from "../models/user.js";

export const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn,
  });
};

export const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

export const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = "60ae21b17712422ce067d2f5";

  User.findOne({
    email,
  })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }

      return bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => {
              res.redirect("/");
            });
          }

          res.redirect("/login");
        })
        .catch((err) => {
          console.log("LOGIN", err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

export const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: {
              items: [],
            },
          });

          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

export const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
