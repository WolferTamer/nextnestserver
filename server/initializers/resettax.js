const {db, sequelize} = require("../db")
const Sequelize = require("sequelize")
const getStateCode = require("../utils/getStatecode")
//Sleep function is used for delay between API calls. If there is no delay, API Ninja will return only errors for most API calls.
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

module.exports = async () => {

    city = sequelize.models.city
    cities = await city.findAll()
    tax = sequelize.models.tax
    //Empty the tax table before starting
    await tax.destroy({
        truncate: true,
    });

    const myHeaders = new Headers();
    myHeaders.append("X-Api-Key", process.env.APININJAKEY);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    //Count the amount of cities handled so we know when all API calls are finished
    //Needs to be seperate from i because API calls are async while the for loop itself is not
    let count = 0;
    console.log('Started updating taxes')
    for(let i = 0; i < cities.length; i++) {
        await sleep(50);
        const city = cities[i];
        fetch(`https://api.api-ninjas.com/v1/propertytax?city=${city.name}&state=${getStateCode(city.state)}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                //Some cities have multiple zip codes under the same name, this averages all of them
                let avg25 = 0;
                let avg75 = 0;
                if(result.length > 0) {
                    for(const value of result) {
                        avg25+= value.property_tax_25th_percentile;
                        avg75+= value.property_tax_75th_percentile;
                    }
                    
                    avg25 /= result.length
                    avg75 /= result.length
                }
                
                fetch(`https://api.api-ninjas.com/v1/salestax?city=${city.name}&state=${city.state}`, requestOptions)
                .then((response) => response.json())
                .then(async (result) => {
                    let sales = 0;
                    if(result.length > 0) {
                        for(const value of result) {
                            sales+= parseFloat(value.total_rate);
                        }
                        sales/= result.length
                    }
                    count++
                    if(sales || avg25 || avg75) {
                        data = {salestax: sales, propertytaxquarter: avg25, propertytaxthreequarters: avg75, cityId: city.id}
                        await tax.upsert(data)
                        console.log
                    } else {
                        console.error(`No Tax Info on ${city.name}`)
                    }
                    if(count >= cities.length) {
                        console.log('Finished loading tax information')
                    }
                })
                .catch((error) => console.error(error));
            })
            .catch((error) => console.error(error));
    }
}