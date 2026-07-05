var mysql = require("mysql2");
import { Sequelize } from "sequelize";
const SQLHOST = process.env.MYSQLHOST || "localhost";
const SQLNAME = process.env.MYSQLNAME || "cities";
//Start the connection to SQL

export const sequelize = new Sequelize(
  SQLNAME,
  process.env.MYSQLUSER!,
  process.env.MYSQLPASSWORD,
  {
    host: SQLHOST,
    dialect: "mysql",
    define: { freezeTableName: true },
    logging: false,
  },
);
