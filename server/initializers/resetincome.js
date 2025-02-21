//CURRENTLY PSUEDOCODE
const {sequelize} = require("../db")
const Sequelize = require("sequelize")
const fs = require("fs")
const { parse } = require("csv-parse");
//Columns in used CSV:
// 0: State
// 1: Single Filer Rates
// 3: Single Filer Brackets
// 4: Married Filer Rates
// 6: Married Filer Brackets
// 7: Standard Deduction Single
// 8: Standard Deduction Couple
// 12: Has local income tax

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

module.exports = async () => {
    let incometaxes = []
    city = sequelize.models.city
    incometax = sequelize.models.incometax
    tax = sequelize.models.tax
    await incometax.destroy({
        truncate: true,
    });
    fs.createReadStream("./income-tax.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
        
            if(row[1].includes('none') || row[1].includes(" ")) {
                return;
            }
            let state = row[0]
            let parenthesisIndex = state.indexOf(' ')
            if(parenthesisIndex >= 0) {
                state = state.substring(0,parenthesisIndex)
                let standardsingle = parseFloat(row[7].replace(/[^0-9.]/g, ''));
                let standardmarried = parseFloat(row[8].replace(/[^0-9.]/g, ''));
                let localincome = row[12]==="true"
                let cities = await city.findAll({where: {
                    state: state
                },
                include: [{model:tax}]})
                for(let object of cities) {
                    if(!object.tax) { continue; }
                    let taxobject = {}
                    let shouldadd = false
                    if(localincome != object.tax.localtaxes) {
                        taxobject.localtaxes = localincome
                        shouldadd = true
                    }
                    if(standardsingle) {
                        taxobject.singlestandarddeduction = standardsingle
                        shouldadd = true
                    }
                    if(standardmarried) {
                        taxobject.marriedstandarddeduction = standardmarried
                        shouldadd = true
                    }
                    if(shouldadd) {
                        console.log(`Object ${object.id} is being updated with ${localincome} ${standardsingle} ${standardmarried}`)
                        tax.update(taxobject,
                            {where: {id:object.id}}
                        )
                        await sleep(20)
                    }
                }
            }
            let singlerate =  parseFloat(row[1].replace(/%/g, ''));
            let singlebracket = parseFloat(row[3].replace(/\$/g, '').replace(/,/g, ''));

            let marriedrate =  parseFloat(row[4].replace(/%/g, ''));
            let marriedbracket = parseFloat(row[6].replace(/\$/g, '').replace(/,/g, ''));
            if(singlerate > 0) { 
                incometaxes.push({state: state, bracket:singlebracket, rate:singlerate, married:false})
            }
            if(marriedrate > 0) {
                incometaxes.push({state: state, bracket:marriedbracket, rate:marriedrate, married:true})
            }
        
    }).on("end", ()=> {
        incometax.bulkCreate(incometaxes)
    })
}