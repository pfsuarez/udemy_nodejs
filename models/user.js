import mongodb from "mongodb";
import { getDb } from "../helper/database.js";

const collectionName = "users";

export class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    return getDb().collection(collectionName).insertOne(this);
  }

  static findById(id) {
    return getDb()
      .collection(collectionName)
      .findOne({ _id: new mongodb.ObjectId(id) });
  }
}
