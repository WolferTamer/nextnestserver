const {sequelize} = require("../db")

module.exports = {
    //TODO: Add params and results that correspond to city IDs and name/states
    get: {
        route: "/api/tax",
        execute: async (req, res) => {

            tax = sequelize.models.tax
            let taxes

            
            taxes = await tax.findAll()
            

            
            
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