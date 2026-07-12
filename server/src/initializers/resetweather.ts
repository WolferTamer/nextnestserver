import { weatherCreateInput } from "../generated/prisma/models";
import { cityRepository } from "../repositories/cityRepository";
import { weatherRepository } from "../repositories/weatherRepository";
import { City } from "../types";
import { isErr } from "../utils/errorGuards";

//Sleep function is used for delay between API calls. If there is no delay, API Ninja will return only errors for most API calls.
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async () => {
  console.log("Starting Weather Reset");
  const cities = await cityRepository.getAll();

  if (isErr(cities)) {
    throw Error("Unable to find cities" + cities.error);
  }

  //Empty the weather table before starting

  const myHeaders = new Headers();

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  } satisfies RequestInit;
  let count = 0;
  let stationIdMap: { [key: number]: string } = {};
  for (let i = 0; i < cities.length; i++) {
    await sleep(300);
    const city = cities[i];
    fetch(
      `https://www.ncei.noaa.gov/cdo-web/api/v2/stations?extent=${city.lat - 0.2},${city.lon - 0.2},${city.lat + 0.2},${city.lon + 0.2}&datasetid=NORMAL_ANN&limit=25`,
      {
        headers: {
          token: process.env.CDO_TOKEN!,
        },
        method: "GET",
        redirect: "follow",
      },
    ).then((stations) => {
      count++;
      if (stations.status == 200) {
        stations.json().then((json) => {
          if (json.results && json.results.length > 1) {
            let station = json.results.find((s: { [key: string]: any }) =>
              s.id.includes("USW"),
            );
            if (!station) station = json.results[0];
            stationIdMap[city.id] = station.id;
          }
          if (count >= cities.length) {
            getWeatherFromStations(stationIdMap, cities);
          }
        });
      }
    });
  }
};

async function getWeatherFromStations(
  stationMap: { [key: number]: string },
  cities: City[],
) {
  for (const city of cities) {
    await sleep(300);
    if (stationMap[city.id]) {
      fetchWeather(stationMap[city.id]).then(async (res) => {
        if (res.status == 200) {
          const json = await res.json();
          console.log(json);

          let data: weatherCreateInput = {
            jantemp: json.results.find(
              (i: { [key: string]: any }) => i.datatype === "DJF-TAVG-NORMAL",
            )?.value,
            janprecipitation: json.results.find(
              (i: { [key: string]: any }) => i.datatype === "DJF-PRCP-NORMAL",
            )?.value,
            julytemp: json.results.find(
              (i: { [key: string]: any }) => i.datatype === "JJA-TAVG-NORMAL",
            )?.value,
            julyprecipitation: json.results.find(
              (i: { [key: string]: any }) => i.datatype === "JJA-PRCP-NORMAL",
            )?.value,
            city: { connect: { id: city.id } },
          };
          weatherRepository.upsertByCityId(city.id, data, data);
        }
      });
    }
  }
  console.log("Finished Creating weather");
}

function fetchWeather(id: string) {
  let str = `https://www.ncei.noaa.gov/cdo-web/api/v2/data`;
  str += `?datasetid=NORMAL_ANN`;
  str += `&stationid=${id}`;
  str += `&startdate=2010-01-01&enddate=2010-12-31`;
  str += `&units=standard`;
  str += `&datatypeid=ANN-TAVG-NORMAL,ANN-TMAX-NORMAL,ANN-TMIN-NORMAL,ANN-PRCP-NORMAL,ANN-SNOW-NORMAL,ANN-PRCP-AVGNDS-GE001HI,ANN-HTDD-NORMAL,ANN-CLDD-NORMAL,DJF-TAVG-NORMAL,MAM-TAVG-NORMAL,JJA-TAVG-NORMAL,SON-TAVG-NORMAL,DJF-PRCP-NORMAL,MAM-PRCP-NORMAL,JJA-PRCP-NORMAL,SON-PRCP-NORMAL`;
  return fetch(str, {
    method: "GET",
    headers: {
      token: process.env.CDO_TOKEN!,
    },
    redirect: "follow",
  });
}
