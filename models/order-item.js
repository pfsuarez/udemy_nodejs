import Sequelize from "sequelize";
import sequelize from "../helper/database.js";

export const OrderItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  qty: Sequelize.INTEGER
});