import fs from "fs";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = path.join(dirname(fileURLToPath(import.meta.url)), "..");

export const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if(err){
      throw(err);
    }
  });
};