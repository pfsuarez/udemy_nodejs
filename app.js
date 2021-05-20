import express from "express";
import bodyParser from "body-parser";
import path from "path";

import { __dirname } from "./helper/helper.js";
import sequelize from "./helper/database.js";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";

import { get404Page } from "./controllers/error.js";

import { Product } from "./models/product.js";
import { User } from "./models/user.js";
import { Cart } from "./models/cart.js";
import { CartItem } from "./models/cart-item.js";
import { Order } from "./models/order.js";
import { OrderItem } from "./models/order-item.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // <- not necessary, by default templates must be in views folder

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1).then((user) => {
    req.user = user;
    next();
  });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404Page);

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});

User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

const useForce = false;
sequelize
  .sync({ force: useForce })
  .then((result) => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Pepe",
        email: "pepe@test.com",
      });
    }
    return Promise.resolve(user);
  })
  //.then(user => user.createCart())
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
