import fs from "fs";
import path from "path";
import { __dirname } from "../helper/path.js";

export const clearImage = (filePath) => {
  filePath = path.join(__dirname, filePath);
  fs.unlink(filePath, (err) => console.log("ERROR DELETING FILE", err));
};
