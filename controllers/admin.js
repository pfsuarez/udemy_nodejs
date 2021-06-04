import { Product } from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add a Product",
    path: "/admin/add-product",
    editing: false,
  });
};

export const postAddProduct = (req, res, next) => {
  const title = req.body.title.trim();
  const imageUrl = req.body.imageUrl.trim();
  const description = req.body.description.trim();
  const price = req.body.price;
  const userId = req.user._id;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user, //passing entire user object, mongoose will map user _id
  });

  product
    .save()
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};

export const postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title.trim();
  const imageUrl = req.body.imageUrl.trim();
  const description = req.body.description.trim();
  const price = req.body.price;

  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save().then(() => res.redirect("/admin/products"));
    })
    .catch((err) => console.log(err));
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.productId;

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit a Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

export const getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id") //specify fields names. using - exclude that field
    // .populate("userId", "name") // get the fields from the relationship. Second param specify wich fields
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        path: "/admin/products",
        pageTitle: "Admin Products",
      });
    })
    .catch((err) => console.log(err));
};

export const postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
