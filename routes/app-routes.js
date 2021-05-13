import express from "express";

const router = express.Router();

const users = [];

router.get("/users", (req, res, next) => {
  res.render("users", { pageTitle: "Users List Page", path: "/users", users: users });
});

router.get("/", (req, res, next) => {
  res.render("home", { pageTitle: "Home Page", path: "/" });
});

router.post("/", (req, res, next) => {
  users.push({ userName: req.body.userName });

  res.redirect("/users");
});

export default router;
