import { taxCreateInput } from "../generated/prisma/models";
import { cityRepository } from "../repositories/cityRepository";
import { taxRepository } from "../repositories/taxRepository";
import { isErr } from "../utils/errorGuards";
import getStateCode from "../utils/getStateCode";
//Sleep function is used for delay between API calls. If there is no delay, API Ninja will return only errors for most API calls.
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async () => {
  //Empty the tax table before starting
  const cities = await cityRepository.getAll();
  if (isErr(cities)) throw Error("Unable to load cities");
  const myHeaders = new Headers();
  myHeaders.append("X-Api-Key", process.env.APININJAKEY!);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  } satisfies RequestInit;
  //Count the amount of cities handled so we know when all API calls are finished
  //Needs to be seperate from i because API calls are async while the for loop itself is not
  let count = 0;
  console.log("Started updating taxes");
  for (let i = 0; i < cities.length; i++) {
    await sleep(50);
    const city = cities[i];
    console.log(city.name);
    console.log(
      `https://api.api-ninjas.com/v1/propertytax?city=${city.name}&state=${city.statecode}`,
    );
    fetch(
      `https://api.api-ninjas.com/v1/propertytax?city=${city.name}&state=${city.statecode}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then(async (result) => {
        //Some cities have multiple zip codes under the same name, this averages all of them
        let avg25 = 0;
        let avg75 = 0;
        console.log(result);
        if (result.length > 0) {
          for (const value of result) {
            avg25 += value.property_tax_25th_percentile;
            avg75 += value.property_tax_75th_percentile;
          }

          avg25 /= result.length;
          avg75 /= result.length;
        }
        try {
          let response = await fetch(
            `https://api.api-ninjas.com/v1/salestax?city=${city.name}&state=${city.state}`,
            requestOptions,
          );
          let result = await response.json();
          let sales = 0;
          if (result.length > 0) {
            for (const value of result) {
              sales += parseFloat(value.state_rate);
            }
            sales /= result.length;
          }
          count++;
          if (sales || avg25 || avg75) {
            const data: taxCreateInput = {
              salestax: sales,
              propertytaxquarter: avg25,
              propertytaxthreequarters: avg75,
              city: { connect: city },
            };
            await taxRepository.upsertByCityId(city.id, data, data);
          } else {
            console.error(`No Tax Info on ${city.name}`);
          }
          if (count >= cities.length) {
            console.log("Finished loading tax information");
          }
        } catch (e) {
          console.log(`unable to get taxes for ${city.name}`);
        }
      })
      .catch((error) => console.error(error));
  }
};
