//This folder runs all the logic of initializing and updating the database.
//The only input this requires is a CSV file with the names, states, and populations of all the cities you want to add named us-cities-table.csv
//The order of values in this file should be: [population, name, state]
import resetcity from "./resetcity.js";
import resettax from "./resettax.js";
import resetweather from "./resetweather.js";
import resetincome from "./resetincome.js";
module.exports = async (args: string[]) => {
  //The first row is ignored.

  if (args.includes("init")) {
    await resetcity(async () => {
      await resettax();
      resetweather();
    });
  } else {
    if (args.includes("resetcity")) {
      await resetcity();
    }
    if (args.includes("resettax")) {
      await resettax();
      resetincome();
    }
    if (args.includes("resetweather")) {
      resetweather();
    }
    if (args.includes("resetincome")) {
      resetincome();
    }
  }
};
