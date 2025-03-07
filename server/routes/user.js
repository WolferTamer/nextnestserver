const { sequelize } = require("../db")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

module.exports = {
    //PARAMS: id (optional, the id number of the city), name (option, the name, or partial name, of the city)
    //RESULTS: No params results in a list of all cities.
    //         Only name results in a list of cities that contain the given name
    //         Id results in the city that has that id
    //TODO: Require state along with a city name
    get:{
        route:"/api/user",
        execute: async(req,res) => {
            let id = req.query.id
            const token = req.headers.authorization?.split(' ')[1];
            if(!token) {
                res.status(403).json({
                    error: "No Authorization",
                });
                return;
            }
            jwt.verify(token, process.env.SECRETKEY, async (err, user) => {
                //Compare requested id and id from token
                //Fetch user from SQL
                //If mismatch return 403
                //If match return 200 with account information excluding password
                if(err || !user) {
                    res.status(403).json({
                        error: "Not Authorized",
                    });
                    return;
                }
                let tokenid = user.userId
                if(id == tokenid) {
                    let userobj = (await sequelize.models.user.findAll({where: {
                        userid: id
                    }}))[0]
                    if(!userobj) {
                        res.status(400).json({
                            error: "No User with that ID"
                        });
                        return
                    }
                    const filteredObj = {
                        userid: id,
                        username: userobj.username,
                        email: userobj.email,
                        salary: userobj.salary
                    }
                    res.status(200).json({
                        user: filteredObj
                    });
                    return;
                } else {
                    res.status(403).json({
                        error: "Not Authorized",
                    });
                    return;
                }

            })
            
        }
    },
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
                    res.status(203).json({
                        message:`User with email ${user.email} created`,
                        auth: token,
                        user: user.userid
                    })

                }
        }
    },
    put: {
        route:"/api/user",
        execute: async (req, res) => {
            const token = req.headers.authorization?.split(' ')[1];
            if(!token) {
                res.status(403).json({
                    error: "No Authorization",
                });
                return;
            }
            jwt.verify(token, process.env.SECRETKEY, async (err, u) => {
            let id = req.query.id
            if(!id) {
                res.status(400).json({
                    error:"No ID."
                })
                return;
            }
            const usermodel = sequelize.models.user
            if(!req.body) {
                res.status(400).json({
                    error:"No body attached."
                })
                return;
            }
            
            let body = req.body
            let updateBody = {}
            if(body.salary && (typeof body.salary !== "number" || body.salary % 1 != 0 || body.salary < 0)) {
                res.status(400).json({
                    error:"Salary must be an integer greater than or equal to 0."
                })
                return;
            } else {
                updateBody.salary = body.salary
            }
            if(!body.salary) {
                res.status(400).json({
                    error:"You must include at least one updatable option such as salary."
                })
                return;
            }
            try {
                await usermodel.update(
                    updateBody,
                    {
                    where: {
                        userid: id,
                    },
                    },
                );
                let userobj = (await usermodel.findAll({where: {
                    userid: id
                }}))[0]
                
                const filteredObj = {
                    userid: id,
                    username: userobj.username,
                    email: userobj.email,
                    salary: userobj.salary
                }
                res.status(200).json({
                    user: filteredObj
                });
                return;
            } catch(e) {
                console.log(e)
                res.status(500).json({
                    error:"An internal error occured while updating the user."
                })
                return;
            }
        })
    }
    }
}