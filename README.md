# NextNest Node Server

## Description

NextNest is an application designed to allow users to take quizzes and search through a database in order to find cities they can move to. The NodeJS/React repository contains the front end (React) and the database logic (NodeJS). Quiz recommendations will be handled by a seperate AI server.

## Initializing

1. Clone the repository
2. Run `npm install` in both the base file and `/client`
3. Create a MYSQL database with the name `cities` and create an account with full access to it.
4. Set environment variables as described below.
5. If you changed the port of the node server, change the env variable API_URL in /client.
6. Create a file named `us-cities-table.csv` in the root folder. An example in the correct format can be found [here.](https://drive.google.com/file/d/1r_Ae3mU5pl_e-a67_X11EedyGN9LgZgX/view?usp=sharing) Keep in mind that the order of the columns matter.
7. Run the Node server with `npm start init` inside the root folder. Run the react server with `npm run dev` inside `/client`.

## Environment Variables

- **MYSQLHOST:** The host IP for your MySQL server. localhost by default.
- **MYSQLUSER:** The username you want to use for your MySQL server. (required)
- **MYSQLPASSWORD:** The password for your MySQL username. (required)
- **APININJAKEY:** Your API key for APINinja. (required)
- **OPENWEATHERKEY:** Your API key for OpenWeather. (required)