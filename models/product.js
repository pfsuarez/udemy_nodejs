import mongodb from "mongodb";
import { getDb } from "../helper/database.js";

const collectionName = "products";

export class Product {
  constructor(title, price, description, imageUrl, userId, id) {
    this.title = title.trim();
    this.price = price.trim();
    this.description = description.trim();
    this.imageUrl = imageUrl.trim();
    this.userId = userId;

    if (id) {
      this._id = new mongodb.ObjectId(id);
    }
  }

  save() {
    let dbOp;

    if (this._id) {
      dbOp = getDb()
        .collection(collectionName)
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = getDb().collection(collectionName).insertOne(this);
    }
    return dbOp;
  }

  static fetchAll() {
    return getDb().collection(collectionName).find().toArray();
  }

  static findById(id) {
    return getDb()
      .collection(collectionName)
      .find({ _id: new mongodb.ObjectId(id) })
      .next();
  }

  static deleteById(id) {
    return getDb()
      .collection(collectionName)
      .deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}
