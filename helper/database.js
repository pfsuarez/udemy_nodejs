import mysql from "mysql2";

const pool = mysql.createPool({
  host:"localhost",
  user: "root",
  database: "node-complete",
  password: "root123"
});

export default pool.promise();