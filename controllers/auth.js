import { User } from "../models/user.js";
export const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn,
  });
};

export const postLogin = (req, res, next) => {
  //res.setHeader("Set-Cookie", "loggedIn=true");
  const userId = "60ae21b17712422ce067d2f5";

  User.findById(userId)
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

export const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
