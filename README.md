# NextNest Node Server

## Description

NextNest is an application designed to allow users to take quizzes and search through a database in order to find cities they can move to. The NodeJS/React repository contains the front end (React) and the database logic (NodeJS). Quiz recommendations will be handled by a seperate AI server.

## Initializing

1. Clone the repository
2. Run `npm install` in both the base file and `/client`
3. Create a MYSQL database with the name `cities` and create an account with full access to it.
4. Set environment variables, `PORT` is the optional port Node to host on. `MYSQLHOST` is the address to the MySQL server, localhost by default. `MYSQLUSER` and `MYSQLPASSWORD` are the credentials for the MySQL server. `APININJAKEY` is the key to your API Ninja account.
5. If you changed the port of the Node server, change the ports of `proxy` located inside `/client/vite.config.js` and `/client/package.json`
6. Create a file named `us-cities-table.csv` in the root folder. It should contain a table of population count, city name, and state name in that order. The first row will be used as column names.
7. Run the Node server with `npm start init` inside the root folder. Run the react server with `npm run dev` inside `/client`.