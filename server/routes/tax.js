const {sequelize} = require("../db")

module.exports = {
    //TODO: Add params and results that correspond to city IDs and name/states
    get: {
        route: "/api/tax",
        execute: async (req, res) => {

            tax = sequelize.models.tax
            let taxes

            if(req.query.id) {
                taxes = await tax.findAll({where: {
                    cityId: req.query.id
                }})
            } else if (req.query.name) {
                taxes = await tax.findAll({
                    where: {
                        name: {
                            [Sequelize.Op.like] : `%${req.query.name}%`
                        }
                    }
                })
            } else {
                taxes = await tax.findAll()
            }
            

            
            
            if(taxes.length < 1) {
                res.status(404).json({
                        error: 'No city of that name or id found.'
                    })
                return
            }
            res.json({taxes: taxes})
            
        }
    }
}