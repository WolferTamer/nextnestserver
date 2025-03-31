//Route files may have one of each HTTP method. Each endpoint must have a route and executable.
//You can technically have different routes within each file, but this will be structured so 
//that each route has its own.


const {sequelize} = require("../db")
const Sequelize = require("sequelize")

const convertWeather = (options) => {
    let weather = {model:sequelize.models.weather, attributes:[], where:{}}
    let summer = options%4;
    if(summer > 0) {
        //Considered cold if less than 15 degrees celcius, hot if above 27 degrees celcius
        weather.attributes.push('julytemp')
        weather.where['julytemp'] = summer == 1 ? {[Sequelize.Op.lt]: 292} : summer == 3 ?
            {[Sequelize.Op.gt]: 300} : {[Sequelize.Op.lt]: 300, [Sequelize.Op.gt]: 292}
    }
    options = Math.floor(options / 4)
    const winter = options%4
    if(winter > 0) {
        //Considered cold if less than -1 degrees celcius, warm if above 11 degrees celcius
        weather.attributes.push('jantemp')
        weather.where['jantemp'] = winter == 1 ? {[Sequelize.Op.lt]: 272} : winter == 3 ?
            {[Sequelize.Op.gt]: 284} : {[Sequelize.Op.lt]: 284, [Sequelize.Op.gt]: 272}
    }
    options = Math.floor(options / 4)
    const rain = options%4
    if(rain > 0) {
        //Considered little if less than 0.05m of precipitation , lots if above 0.09
        weather.attributes.push('julyprecipitation')
        weather.where['julyprecipitation'] = rain == 1 ? {[Sequelize.Op.lt]: 0.5} : rain == 3 ?
            {[Sequelize.Op.gt]: 0.09} : {[Sequelize.Op.lt]: 0.09, [Sequelize.Op.gt]: 0.05}
    }
    options = Math.floor(options / 4)
    const humidity = options%4
    if(humidity > 0) {
        //Considered little if less than 70% humidity, lots if above 80
        weather.attributes.push('julyhumidity')
        weather.where['julyhumidity'] = humidity == 1 ? {[Sequelize.Op.lt]: 70} : humidity == 3 ?
            {[Sequelize.Op.gt]: 80} : {[Sequelize.Op.lt]: 80, [Sequelize.Op.gt]: 70}
    }
    return weather
}

module.exports = {
    //PARAMS: name (optional string), weather (optional number using bit info)
    //RESULTS: All cities that contain the name string and match weather preferences
    get: {
        route: "/api/search",
        execute: async (req, res) => {

            const city = sequelize.models.city
            let query = {include:[]}

            const name = req.query.name
            const weatherbinary = req.query.weather
            
            //Must have at least one search method
            if(!name && !weatherbinary) {
                res.status(400).json({
                    error: 'No search parameters provided.'
                })
                return;
            }

            if(name) {
                if(typeof name !== "string") {
                    res.status(400).json({
                        error: 'Name must be string'
                    })
                    return; 
                }
                query.where = {
                        name: {
                            [Sequelize.Op.like] : `%${req.query.name}%`
                        }
                    }
                
            }
            if (weatherbinary) {
                if(isNaN(weatherbinary) ) {
                    res.status(400).json({
                        error: 'Weather must be a number of value 1-255'
                    })
                    return;
                }
                // Weather binary takes in an integer which can be broken down by 2 bits at a time
                // Summer Temp (Bits 1 & 2): 0 - No Preference, 1 - Cool, 2 - Moderate, 3 - Hot
                // Winter Temp (Bits 3 & 4): 0 - No Preference, 1 - Cold, 2 - Moderate, 3 - Warm
                // Rain Preference (Bits 5 & 6): 0 - No Preference, 1 - Little Rain, 2 - Moderate Rain, 3 - Lots of Rain
                // Humidity (Bits 7 & 8): 0 - No Preference, 1 - Not Humid, 2 - Average, 3 - Very Humid
                // Using this system instead of individual params will save on communicaiton time
                query.include.push(convertWeather(weatherbinary))
            }

            let cities = await city.findAll(query)

            res.json({cities: cities})
            
        }
    }
}