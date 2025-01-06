//This folder runs all the logic of initializing and updating the database.
//The only input this requires is a CSV file with the names, states, and populations of all the cities you want to add named us-cities-table.csv
//The order of values in this file should be: [population, name, state]
//The first row is ignored.
const args = process.argv;

if(args.includes('init')) {
    require('./resetcity.js')
}