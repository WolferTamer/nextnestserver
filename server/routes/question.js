const questions = require( "../../questions.json")
const { sequelize } = require("../db")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const usermodel = sequelize.models.user

module.exports = {
    //PARAMS: name (optional string), weather (optional number using bit info)
    //RESULTS: All cities that contain the name string and match weather preferences
    get: {
        route: "/api/question",
        execute: async (req, res) => {
            const token = req.headers.authorization?.split(' ')[1];
            if(!token) {
                res.status(403).json({
                    error: "No Authorization header",
                });
                return;
            }
            jwt.verify(token, process.env.SECRETKEY, (err, user) => {
                if (err) return res.sendStatus(403);
                req.user = user;

                res.status(200).json({
                    questions:questions
                })
            });


        }
    }
}