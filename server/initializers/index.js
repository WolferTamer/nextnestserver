//This folder runs all the logic of initializing and updating the database.
//The only input this requires is a CSV file with the names, states, and populations of all the cities you want to add named us-cities-table.csv
//The order of values in this file should be: [population, name, state]
const resetcity = require('./resetcity.js');
const resettax = require('./resettax.js')
const resetweather = require('./resetweather.js')
const definemodels = require('./definemodels.js')
const resetincome = require('./resetincome.js')
module.exports = async (args) => {
    
    //The first row is ignored.

    if(args.includes('init')) {
        await resetcity(async () => {
            await resettax()
            resetweather()
        })
    } else {
        if (args.includes('resetcity')) {
            await resetcity()
        }
        if(args.includes('resettax')) {
            await resettax()
            resetincome()
        }
        if(args.includes('resetweather')) {
            resetweather()
        }
        if(args.includes('resetincome')) {
            resetincome()
        }
    }

}