export const getLogin = (req, res, next) => {
  console.log("", req.session.isLoggedId);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn,
  });
};

export const postLogin = (req, res, next) => {
  //res.setHeader("Set-Cookie", "loggedIn=true");
  req.session.isLoggedId = true;
  res.redirect("/");
};
