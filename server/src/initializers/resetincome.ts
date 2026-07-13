//CURRENTLY PSUEDOCODE
import fs from "fs";
import { parse } from "csv-parse";
import { cityRepository } from "../repositories/cityRepository";
import { isErr } from "../utils/errorGuards";
import {
  incometaxCreateInput,
  taxCreateInput,
} from "../generated/prisma/models";
import { taxRepository } from "../repositories/taxRepository";
import { incomeTaxRepository } from "../repositories/incometaxRepository";
//Columns in used CSV:
// 0: State
// 1: Single Filer Rates
// 3: Single Filer Brackets
// 4: Married Filer Rates
// 6: Married Filer Brackets
// 7: Standard Deduction Single
// 8: Standard Deduction Couple
// 12: Has local income tax

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default async () => {
  let incometaxes: incometaxCreateInput[] = [];
  fs.createReadStream("./income-tax.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
      if (row[1].includes("none") || row[1].includes(" ")) {
        return;
      }
      let state = row[0] as string;
      let parenthesisIndex = state.indexOf(" ");
      if (parenthesisIndex >= 0) {
        state = state.substring(0, parenthesisIndex).trim();
        let standardsingle = parseFloat(row[7].replace(/[^0-9.]/g, ""));
        let standardmarried = parseFloat(row[8].replace(/[^0-9.]/g, ""));
        let localincome = row[12] === "true";
        let cities = await cityRepository.findByState(state, { tax: true });
        if (isErr(cities)) {
          throw Error("Could not get cities.");
        }
        if (cities) {
          for (let object of cities) {
            if (object.tax.length < 1) {
              continue;
            }
            const taxInfo = object.tax[0];
            let taxobject: taxCreateInput = {
              city: { connect: { id: object.id } },
            };
            let shouldadd = false;
            if (localincome != taxInfo.localtaxes) {
              taxobject.localtaxes = localincome;
              shouldadd = true;
            }
            if (standardsingle) {
              taxobject.singlestandarddeduction = standardsingle;
              shouldadd = true;
            }
            if (standardmarried) {
              taxobject.marriedstandarddeduction = standardmarried;
              shouldadd = true;
            }
            if (shouldadd) {
              console.log(
                `Object ${object.id} is being updated with ${localincome} ${standardsingle} ${standardmarried}`,
              );
              await taxRepository.upsertByCityId(
                object.id,
                taxobject,
                taxobject,
              );
              await sleep(20);
            }
          }
        }
      }
      let singlerate = parseFloat(row[1].replace(/%/g, ""));
      let singlebracket = parseFloat(
        row[3].replace(/\$/g, "").replace(/,/g, ""),
      );

      let marriedrate = parseFloat(row[4].replace(/%/g, ""));
      let marriedbracket = parseFloat(
        row[6].replace(/\$/g, "").replace(/,/g, ""),
      );
      if (singlerate > 0) {
        incometaxes.push({
          state: state,
          bracket: singlebracket,
          rate: singlerate,
          married: false,
        });
      }
      if (marriedrate > 0) {
        incometaxes.push({
          state: state,
          bracket: marriedbracket,
          rate: marriedrate,
          married: true,
        });
      }
    })
    .on("end", () => {
      incomeTaxRepository.bulkReset(incometaxes);
    });
};
