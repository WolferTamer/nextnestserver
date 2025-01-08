var mysql = require('mysql2');
const Sequelize = require('sequelize')
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

let sequelize = new Sequelize('cities', process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
    host: SQLHOST,
    dialect: 'mysql',
    define: {freezeTableName: true}
})

module.exports = {db: con, sequelize: sequelize};