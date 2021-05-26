import mongoose from "mongoose";

const Schema = mongoose.Schema;
const productSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export const Product = mongoose.model("Product", productSchema);

// // import mongodb from "mongodb";
// // import { getDb, getObjectId } from "../helper/database.js";

// const collectionName = "products";

//export class Product {
//   constructor(title, price, description, imageUrl, userId, id) {
//     this.title = title.trim();
//     this.price = price.trim();
//     this.description = description.trim();
//     this.imageUrl = imageUrl.trim();
//     this.userId = userId;

//     if (id) {
//       this._id = getObjectId(id);
//     }
//   }

//   save() {
//     let dbOp;

//     if (this._id) {
//       dbOp = getDb()
//         .collection(collectionName)
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = getDb().collection(collectionName).insertOne(this);
//     }
//     return dbOp;
//   }

//   static fetchAll() {
//     return getDb().collection(collectionName).find().toArray();
//   }

//   static findById(id) {
//     return getDb()
//       .collection(collectionName)
//       .find({ _id: getObjectId(id) })
//       .next();
//   }

//   static deleteById(id) {
//     return getDb()
//       .collection(collectionName)
//       .deleteOne({ _id: getObjectId(id) });
//   }
//}
