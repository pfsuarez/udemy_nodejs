import db from "../helper/database.js";

import { Cart } from "./cart.js";

export class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * from products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id=?", [id]);
  }

  static deleteById(id) {}
}
