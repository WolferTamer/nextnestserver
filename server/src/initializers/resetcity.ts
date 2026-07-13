import fs from "fs";
import { cityRepository } from "../repositories/cityRepository";
import { cityCreateInput } from "../generated/prisma/models";
import { createInterface } from "readline";
import { isErr } from "../utils/errorGuards";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async (callback?: () => any) => {
  const cityFromDB = await cityRepository.getAll();
  if (isErr(cityFromDB)) throw Error(cityFromDB.error);

  console.log("Defining city model!");

  console.log("Beginning parse through CSV file.");
  //Get the amount of rows in the CSV. It uses this value so it knows when to use the callback. The callback is used for
  //Running the table inits that rely on city
  let count = 0;
  let maxcount = 0;

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  } satisfies RequestInit;
  const rl = createInterface({
    input: fs.createReadStream("./us-cities-table.csv"),
    crlfDelay: Infinity,
  });
  let cities: {
    id: number;
    create: cityCreateInput;
    update: cityCreateInput;
  }[] = [];
  for await (const line of rl) {
    const fixedLine = line.replaceAll('"', "");
    maxcount++;
    const row = fixedLine.split(",");
    const oldCity = cityFromDB.find((c) => c.name === row[1]);
    if (row[0].includes("pop2024")) {
      continue;
    }
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${row[1]},${row[3]},US&appid=${process.env.OPENWEATHERKEY}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then(async (result) => {
        let lat = result[0] ? result[0].lat : 0;
        let lon = result[0] ? result[0].lon : 0;
        //Check if the the city already exists in the DB. If it does, update it. Otherewise, insert a new city
        cities.push({
          id: oldCity ? oldCity.id : -1,
          create: {
            name: row[1],
            population: parseInt(row[0].replaceAll('"', "")),
            state: row[2],
            statecode: row[3],
            density: parseInt(row[4].replaceAll('"', "")),
            growth: parseFloat(row[5].replaceAll('"', "")),
            lat: lat,
            lon: lon,
          },
          update: {
            name: row[1],
            population: parseInt(row[0].replaceAll('"', "")),
            state: row[2],
            statecode: row[3],
            density: parseInt(row[4].replaceAll('"', "")),
            growth: parseFloat(row[5].replaceAll('"', "")),
            lat: lat,
            lon: lon,
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
    if (cities.length >= 50) {
      await cityRepository.upsertMany(cities);
      cities = [];
    }
    await sleep(50);
  }

  if (cities.length > 0) {
    await cityRepository.upsertMany(cities);
  }
};
