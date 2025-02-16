const { sequelize } = require("../db")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const usermodel = sequelize.models.user

module.exports = {
    get: {
        route:"/api/auth",
        execute: async (req, res) => {
            
            const token = req.headers.authorization?.split(' ')[1];
            if(!token) {
                res.status(400).json({
                    error: "No body or authorization header",
                });
                return;
            }
            jwt.verify(token, process.env.SECRETKEY, (err, user) => {
                if (err) return res.sendStatus(403);
                req.user = user;
                res.status(200).json({
                    auth:token
                })
            });
            
        }
    },
    post: {
        route:"/api/auth",
        execute: async (req, res) => {
            if(!req.body) {
                res.status(400).json({
                    error: "No body",
                });
                return;
            }
            let user = req.body.user
            if(!user) {
                res.status(400).json({
                    error: "No user object in body",
                });
                return;
            }
            let email = user.email
            let password = user.password
            if(!email || !password) {
                res.status(400).json({
                    error: "User object missing email or password",
                });
                return;
            }
            let userObject = await usermodel.findAll({
                where: {
                    email:email
                }
            })
            let hashed = userObject[0].password
            bcrypt.compare(password, hashed, (err, data) => {
                if(err) {
                    res.status(500).json({
                        error:"Internal error"
                    })
                    return;
                }
                if(data) {
                    const token = jwt.sign({ userId: userObject.userid }, process.env.SECRETKEY);
                    res.status(200).json({
                        auth:token
                    })
                    return;
                } else {
                    res.status(403).json({
                        error:"Invalid credentials"
                    })
                    return;
                }
            })
        }
    }
}