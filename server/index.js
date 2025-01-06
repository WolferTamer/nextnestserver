const express = require('express');
const cors = require('cors')
const PORT = process.env.PORT || 3001;
const SQLHOST = process.env.MYSQLHOST || "localhost";
const app = express();
var mysql = require('mysql2');
const dotenv = require('dotenv').config()

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

app.use(cors());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server Wow!" });
  });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });