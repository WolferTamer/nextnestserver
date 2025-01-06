//Route files may have one of each HTTP method. Each endpoint must have a route and executable.
//You can technically have different routes within each file, but this will be structured so 
//that each route has its own.


const db = require("../db")

module.exports = {
    //PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
    //RESULTS: No params results in a list of all cities.
    //         Only name results in a list of cities that contain the given name
    //         Id results in the city that has that id
    get: {
        route: "/api/city",
        execute: (req, res) => {
            let selectStatement = 'SELECT * FROM cities.city'
            if(req.query.id) {
                selectStatement = `SELECT * FROM cities.city WHERE id = ${req.query.id}`
            } else if (req.query.name) {
                selectStatement = `SELECT * FROM cities.city WHERE name LIKE "%${req.query.name}%"`
            }

            db.query(selectStatement, (err, docs) => {
                if(err) {
                    console.log(err)
                    res.status(500).json({
                        error: 'Internal Server Error',
                        message: err
                    })
                    return
                }
                if(docs.length < 1) {
                    res.status(404).json({
                        error: 'No city of that name or id found.'
                    })
                    return
                }
                res.json({cities: docs})
            })
        }
    }
}