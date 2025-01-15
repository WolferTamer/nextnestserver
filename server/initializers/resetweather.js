const {sequelize} = require("../db")
const Sequelize = require("sequelize")
const getStateCode = require("../utils/getStatecode")
//Sleep function is used for delay between API calls. If there is no delay, API Ninja will return only errors for most API calls.
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

module.exports = async () => {
    console.log('Starting Weather Reset')
    city = sequelize.models.city
    cities = await city.findAll()

    //Empty the weather table before starting

    weather = sequelize.models.weather
    await weather.destroy({
        truncate: true,
      });


    const myHeaders = new Headers();

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    //Count the amount of cities handled so we know when all API calls are finished
    //Needs to be seperate from i because API calls are async while the for loop itself is not
    let count = 0;
    for(let i = 0; i < cities.length; i++) {
        await sleep(50);
        const city = cities[i];
        let url = `https://history.openweathermap.org/data/2.5/aggregated/month?`
        url += `month=1`
        url += `&lat=${city.lat}`
        url += `&lon=${city.lon}`
        url += `&appid=${process.env.OPENWEATHERKEY}`
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                let data = {jantemp: 0, janhumidity: 0, janwind: 0, janprecipitation: 0, janclouds: 0,
                    julytemp: 0, julyhumidity: 0, julywind: 0, julyprecipitation: 0, julyclouds: 0
                }
                if(result.result) {
                    data.jantemp = result.result.temp.median
                    data.janhumidity = result.result.humidity.median
                    data.janwind = result.result.wind.median
                    data.janprecipitation = result.result.precipitation.mean
                    data.janclouds = result.result.clouds.median
                }
                url = `https://history.openweathermap.org/data/2.5/aggregated/month?`
                url += `month=7`
                url += `&lat=${city.lat}`
                url += `&lon=${city.lon}`
                url += `&appid=${process.env.OPENWEATHERKEY}`
                fetch(url, requestOptions)
                .then((response) => response.json())
                .then(async(result) => {
                    count++
                    if(result.result) {
                        data.julytemp = result.result.temp.median
                        data.julyhumidity = result.result.humidity.median
                        data.julywind = result.result.wind.median
                        data.julyprecipitation = result.result.precipitation.mean
                        data.julyclouds = result.result.clouds.median
                    }
                    data.cityId = city.id
                    
                    await weather.upsert(data)

                    if(count >= cities.length) {
                        console.log('Finished loading Weather information')
                    }
                })
                .catch((error) => console.error(error));
            })
            .catch((error) => console.error(error));
    }

}