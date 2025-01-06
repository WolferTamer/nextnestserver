const { parse } = require("csv-parse");
const fs = require("fs");
const {db} = require("../db")
const Sequelize = require("sequelize")
const SQLHOST = process.env.MYSQLHOST || 'localhost';

console.log("Defining city model!")
let sequelize = new Sequelize('cities', process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
    host: SQLHOST,
    dialect: 'mysql',
})

sequelize.define('city', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull:false
    },
    name: {
        type: Sequelize.STRING,
        allowNull:false
    },
    name: {
        type: Sequelize.INTEGER,
        allowNull:false
    }
})

sequelize.sync()
.then(() => {
    console.log('Database & tables synchronized!');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });

console.log('Beginning parse through CSV file.')
db.query("TRUNCATE cities.city", [], function (error) {
    if (error) {
      return console.log(error.message);
    }
    console.log('Cleared cities.city')
  });
fs.createReadStream("./us-cities-table.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    db.query('INSERT INTO cities.city (name, state, population) VALUES (?, ?, ?)',
        [row[1],row[2],row[0]],
        function (error) {
            if (error) {
              return console.log(error.message);
            }
          }
    )
  })
  .on("end", function () {
    console.log("Finished parsing through CSV file");
  })
  .on("error", function (error) {
    console.log(error.message);
  });