const { sequelize } = require("../db")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

module.exports = {
    //PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
    //RESULTS: No params results in a list of all cities.
    //         Only name results in a list of cities that contain the given name
    //         Id results in the city that has that id
    //TODO: Require state along with a city name
    post: {
        route:"/api/user",
        execute: async (req, res) => {
            const usermodel = sequelize.models.user
            if(!req.body) {
                res.status(400).json({
                    error:"No body attached."
                })
                return;
            }
            let userobject = req.body.user
            let user = usermodel.build(userobject)
            if(user) {
                
                let hashed = await bcrypt.hash(user.password, 10)
                user.password = hashed
                try{
                    await user.save()
                } catch(e) {
                    if(e.errors[0].message.includes('must be unique')) {
                        res.status(400).json({
                            error:"This email is already in use."
                        })
                    } else {
                    console.log(`user unsaved due to ${e}`)
                        res.status(400).json({
                            error:e.errors[0].message
                        })
                    }
                    return;
                }
                const token = jwt.sign({ userId: user.userid }, process.env.SECRETKEY);
                res.json({
                    message:`User with email ${user.email} created`,
                    auth: token,
                    user: user.userid
                })

            }
        }
    },
    update: {
        route:"/api/user",
        execute: async (req, res) => {
            const usermodel = sequelize.models.user
            if(!req.body) {
                res.status(400).json({
                    error:"No body attached."
                })
                return;
            }
        }
    }
}