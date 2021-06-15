import jwt from "jsonwebtoken";

import { getCustomError } from "../helper/error.js";
import { jwtSecret } from "../helper/configuration.js";

export default (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw getCustomError("Not authenticated", 401, null);
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, jwtSecret);
  } catch (error) {
    throw getCustomError(null, null, error);
  }

  if (!decodedToken) {
    throw getCustomError("Not authenticated", 401, null);
  }

  req.userId = decodedToken.userId;
  next();
};
