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
          ref: "Product",
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

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    (cp) => cp.productId.toString() === product._id.toString()
  );

  const updateCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    const newQty = this.cart.items[cartProductIndex].qty + 1;
    updateCartItems[cartProductIndex].qty = newQty;
  } else {
    updateCartItems.push({
      productId: product._id,
      qty: 1,
    });
  }

  this.cart = {
    items: updateCartItems,
  };

  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (i) => i.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

export const User = mongoose.model("User", userSchema);

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
