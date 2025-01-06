//Route files may have one of each HTTP method. Each endpoint must have a route and executable.
//You can technically have different routes within each file, but this will be structured so 
//that each route has its own.
module.exports = {
    get: {
        route: "/api/city",
        execute: (req, res) => {
            res.json({cities: [
                {name:"Pheonix",state:"Arizona",population:103516}
            ]})
        }
    }
}