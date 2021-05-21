import mongodb from "mongodb";
import { getDb } from "../helper/database.js";

const collectionName = "users";

export class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // { items: [] }
    this.id = new mongodb.ObjectId(id);
  }

  save() {
    return getDb().collection(collectionName).insertOne(this);
  }

  addToCart(product) {
    //const cartProduct = this.cart.items.findIndex(cp => cp._id === product._id)

    const updatedCart = { items: [{ ...product, qty: 1 }] };

    return getDb()
      .collection(collectionName)
      .updateOne({ _id: this.id }, { $set: { cart: updatedCart } });
  }

  static findById(id) {
    return getDb()
      .collection(collectionName)
      .findOne({ _id: new mongodb.ObjectId(id) });
  }
}
