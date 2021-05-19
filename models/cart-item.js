import Sequelize from "sequelize";
import sequelize from "../helper/database.js";

export const CartItem = sequelize.define("cartItem", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  qty: Sequelize.INTEGER
});