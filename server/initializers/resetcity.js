const { parse } = require("csv-parse");
const {db, sequelize} = require("../db")
const fs = require("fs")
const Sequelize = require('sequelize')

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = async (callback) => {
  console.log("Defining city model!")
  

  console.log('Beginning parse through CSV file.')
  //Get the amount of rows in the CSV. It uses this value so it knows when to use the callback. The callback is used for
  //Running the table inits that rely on city
  let count = 0;
  let maxcount = 0;

  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fs.createReadStream("./us-cities-table.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      maxcount++
      sleep(50)
      fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${row[1]},${row[3]},US&appid=${process.env.OPENWEATHERKEY}`, requestOptions)
      .then((response) => response.json())
      .then(async(result) => {
        let lat = result[0] ? result[0].lat : 0
        let lon = result[0] ? result[0].lon : 0
        //Check if the the city already exists in the DB. If it does, update it. Otherewise, insert a new city
        let data = {name: row[1], population: row[0], state: row[2], statecode:row[3],
          density:row[4],growth:row[5], lat:lat, lon:lon}
        await sequelize.models.city.upsert(data)
        count++
        if(count >= maxcount) {
          if(callback) {
            callback()
          }
          console.log("Finished generating city table");
        }
      })
      .catch((error) => {
        console.error(error)
      })
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}