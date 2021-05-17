import fs from "fs";
import path from "path";
import { __dirname } from "../helper/helper.js";

const filePath = path.join(__dirname, "data", "cart.json");

export class Cart {
  static addProduct(id, price) {
    //Fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      //Analyze the cart => find existing products
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id == id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      //Add new product / increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id,
          qty: 1,
        };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += +price;

      fs.writeFile(filePath, JSON.stringify(cart), (err) =>
        console.log("Saving cart...", err)
      );
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(filePath, (error, fileContent) => {
      if (error) {
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      const productQty = product.qty;

      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - price * productQty;

      fs.writeFile(filePath, JSON.stringify(updatedCart), (err) =>
        console.log("Saving cart...", err)
      );
    });
  }
}
