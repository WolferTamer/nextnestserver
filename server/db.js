var mysql = require('mysql2');
const Sequelize = require('sequelize')
const SQLHOST = process.env.MYSQLHOST || "localhost";
//Start the connection to SQL


let sequelize = new Sequelize('cities', process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
    host: SQLHOST,
    dialect: 'mysql',
    define: {freezeTableName: true},
    logging: false
})

module.exports = {sequelize: sequelize};