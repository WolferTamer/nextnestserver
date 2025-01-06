var mysql = require('mysql2');
const SQLHOST = process.env.MYSQLHOST || "localhost";
//Start the connection to SQL
var con = mysql.createConnection({
  host: SQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  insecureAuth: true
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;