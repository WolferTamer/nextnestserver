const {sequelize} = require("../db")

module.exports = {
    //TODO: Add params and results that correspond to city IDs and name/states
    get: {
        route: "/api/weather",
        execute: async (req, res) => {

            weather = sequelize.models.weather
            let data

            
            data = await weather.findAll()
            

            
            
            if(data.length < 1) {
                res.status(404).json({
                        error: 'No city of that name or id found.'
                    })
                return
            }
            res.json({weather: data})
            
        }
    }
}