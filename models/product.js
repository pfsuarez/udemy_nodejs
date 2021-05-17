import fs from "fs";
import path from "path";

import { Cart } from "./cart.js";
import { __dirname } from "../helper/helper.js";

const filePath = path.join(__dirname, "data", "products.json");

const getProductsFromFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, fileContent) => {
      let products = [];
      if (!error) {
        products = JSON.parse(fileContent);
      }

      resolve(products);
    });
  });
};

export class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile().then((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        console.log("updatedProducts", updatedProducts);

        fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) =>
          console.log("Saving Products File...", error)
        );
      } else {
        this.id = Math.random().toString();
        products.push(this);

        fs.writeFile(filePath, JSON.stringify(products), (error) =>
          console.log("Saving Products File...", error)
        );
      }
    });
  }

  static fetchAll() {
    return getProductsFromFile();
  }

  static findById(id) {
    return new Promise((resolve) => {
      getProductsFromFile().then((products) => {
        const product = products.find((p) => p.id === id);

        resolve(product);
      });
    });
  }

  static deleteById(id) {
    return new Promise((resolve) => {
      getProductsFromFile().then((products) => {
        const product = products.find(prod => prod.id === id);
        const updatedProducts = products.filter((p) => p.id !== id);

        fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => {
          if (!error) {
            Cart.deleteProduct(id, product.price);
          }
        });

        resolve();
      });
    });
  }
}
