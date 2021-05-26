import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

export const User = mongoose.model("User", userSchema);

//export class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // { items: [] }
//     this.id = getObjectId(id);
//   }

//   save() {
//     return getDb().collection(collectionName).insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(
//       (cp) => cp.productId.toString() === product._id.toString()
//     );

//     const updateCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       const newQty = this.cart.items[cartProductIndex].qty + 1;
//       updateCartItems[cartProductIndex].qty = newQty;
//     } else {
//       updateCartItems.push({
//         productId: getObjectId(product._id),
//         qty: 1,
//       });
//     }

//     const updatedCart = {
//       items: updateCartItems,
//     };

//     return getDb()
//       .collection(collectionName)
//       .updateOne({ _id: this.id }, { $set: { cart: updatedCart } });
//   }

//   getCart() {
//     const productIds = this.cart.items.map((i) => i.productId);
//     return getDb()
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             qty: this.cart.items.find(
//               (i) => i.productId.toString() === p._id.toString()
//             ).qty,
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(
//       (i) => i.productId.toString() !== productId.toString()
//     );

//     return getDb()
//       .collection(collectionName)
//       .updateOne(
//         { _id: this.id },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: this.id,
//             name: this.name,
//             email: this.email,
//           },
//         };

//         return getDb().collection("orders").insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };

//         return getDb()
//           .collection(collectionName)
//           .updateOne({ _id: this.id }, { $set: { cart: this.cart } });
//       });
//   }

//   getOrders() {
//     // return getDb()
//     //   .collection("orders")
//     //   .find()
//     //   .toArray();

//     return getDb()
//       .collection("orders")
//       .find({ "user._id": this.id })
//       .toArray();
//   }

//   static findById(id) {
//     return getDb()
//       .collection(collectionName)
//       .findOne({ _id: getObjectId(id) });
//   }
//}
