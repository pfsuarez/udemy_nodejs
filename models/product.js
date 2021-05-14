import fs from "fs";
import path from "path";
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
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile().then((products) => {
      products.push(this);

      fs.writeFile(filePath, JSON.stringify(products), (error) =>
        console.log("Saving Products File...", error)
      );
    });
  }

  static fetchAll() {
    return getProductsFromFile();
  }
}
