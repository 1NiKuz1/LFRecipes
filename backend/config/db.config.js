const mysql = require("mysql2");
// create the connection to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "FLRecipes",
});

module.exports = db;
