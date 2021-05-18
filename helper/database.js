import Sequelize from "sequelize";

export default sequelize = new Sequelize("node-complete", "root", "root123", {
  dialect: "mysql",
  host: "localhosst"
});