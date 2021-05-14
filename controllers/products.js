export const products = [];

export const getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add a Product",
    path: "/admin/add-product",
  });
};

export const postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

export const getProducts = (req, res, next) => {
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
};
