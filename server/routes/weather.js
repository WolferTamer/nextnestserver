const {sequelize} = require("../db")

module.exports = {
    //TODO: Add params and results that correspond to city IDs and name/states
    get: {
        route: "/api/weather",
        execute: async (req, res) => {

            weather = sequelize.models.weather
            let data

            if(req.query.id) {
                data = await weather.findAll({where: {
                    cityId: req.query.id
                }})
            } else if (req.query.name) {
                data = await weather.findAll({
                    where: {
                        name: {
                            [Sequelize.Op.like] : `%${req.query.name}%`
                        }
                    }
                })
            } else {
                data = await weather.findAll()
            }

            
            
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