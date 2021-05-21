import { getDb } from "../helper/database.js";

export class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db.collection("product")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
}