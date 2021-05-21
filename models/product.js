import mongodb from "mongodb";
import { getDb } from "../helper/database.js";

const collectionName = "product";

export class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db
      .collection(collectionName)
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    return getDb().collection(collectionName).find().toArray();
  }

  static findById(id) {
    return getDb()
      .collection(collectionName)
      .find({ _id: new mongodb.ObjectId(id) })
      .next();
    //.then((product) => product);
  }
}
