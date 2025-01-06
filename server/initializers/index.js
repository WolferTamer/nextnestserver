//This folder runs all the logic of initializing and updating the database.
//The only input this requires is a CSV file with the names, states, and populations of all the cities you want to add named us-cities-table.csv
//The order of values in this file should be: [population, name, state]
//The first row is ignored.

const { parse } = require("csv-parse");
const fs = require("fs");
const db = require("../db")

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