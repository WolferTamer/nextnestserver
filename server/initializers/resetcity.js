const { parse } = require("csv-parse");
const fs = require("fs");
const {db, sequelize} = require("../db")
const Sequelize = require('sequelize')
const SQLHOST = process.env.MYSQLHOST || 'localhost';
module.exports = (callback) => {
  console.log("Defining city model!")
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
      state: {
          type: Sequelize.STRING,
          allowNull:false
      },
      population: {
          type: Sequelize.INTEGER,
          allowNull:false
      }
  })

  sequelize.sync({alter: true})
  .then(() => {
      console.log('Database & tables synchronized!');
    })
    .catch((err) => {
      console.error('Error synchronizing database:', err);
    });

  console.log('Beginning parse through CSV file.')
  //Get the amount of rows in the CSV. It uses this value so it knows when to use the callback. The callback is used for
  //Running the table inits that rely on city
  let count = 0;
  let maxcount = 0;
  try {
    let content = fs.readFileSync('./us-cities-table.csv', {encoding:'utf8'});
    maxcount = content.split('\n').length-1
  } catch(err) {
  // An error occurred
    console.error(err);
  }
  fs.createReadStream("./us-cities-table.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      //Check if the the city already exists in the DB. If it does, update it. Otherewise, insert a new city
      db.query(`SELECT * FROM cities.city WHERE name="${row[1]}" and state="${row[2]}"`, function (error,existing) {
        
        if(error) {
          count++;
          if(count >= maxcount) {
            callback()
          }
          return console.log(error.message)
        }
        if(existing.length > 0) {
          db.query(`UPDATE cities.city SET population=${row[0]} WHERE id=${existing[0].id}`, (err) => {
            count++;
            if(count >= maxcount) {
              callback()
            }
            if(err) {
              return console.log(error.message)}
          })
        } else {
          db.query('INSERT INTO cities.city (name, state, population, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
            [row[1],row[2],row[0],new Date(), new Date()],
            function (error, res) {
                count++;
                if(count >= maxcount) {
                  callback()
                }
                if (error) {
                  return console.log(error.message);
                }
              }
        )
        }
      })
    })
    .on("end", function () {
      console.log("Finished parsing through CSV file");
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}