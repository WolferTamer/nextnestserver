const {db, sequelize} = require("../db")
const Sequelize = require("sequelize")
const getStateCode = require("../utils/getStatecode")

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

module.exports = () => {
db.query("SELECT id, name, state FROM cities.city", (err, cities) => {

    if(err) {
        console.log(err)
        return
    }
const tax = sequelize.define('tax', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    salestax: {
        type: Sequelize.FLOAT,
        allowNull:true
    },
    propertytaxquarter: {
        type: Sequelize.FLOAT,
        allowNull:true
    },
    propertytaxthreequarters: {
        type: Sequelize.FLOAT,
        allowNull:true
    }
})
sequelize.models.city.hasOne(tax, {
    foreignKey: {
        allowNull: false
    }
})
tax.belongsTo(sequelize.models.city)

db.query('TRUNCATE cities.tax', (err) => {
    if(err) {
        return console.error(err)
    }
})

sequelize.sync({alter:true})
.then(async () => {
    const myHeaders = new Headers();
    myHeaders.append("X-Api-Key", "7mVi2+YxB7nRdaMa3ZJVOg==avYX3Sim9O6bBQkQ");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    let count = 0;
    for(let i = 0; i < cities.length; i++) {
        await sleep(50);
        const city = cities[i];
        fetch(`https://api.api-ninjas.com/v1/propertytax?city=${city.name}&state=${getStateCode(city.state)}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
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
                .then((result) => {
                    let sales = 0;
                    if(result.length > 0) {
                        for(const value of result) {
                            sales+= parseFloat(value.total_rate);
                        }
                        sales/= result.length
                    }
                    count++
                    if(sales || avg25 || avg75) {
                    db.query('INSERT INTO cities.tax (salestax, propertytaxquarter, propertytaxthreequarters, createdAt, updatedAt, cityId) VALUES (?, ?, ?, ?, ?, ?)',
                    [sales,avg25,avg75,new Date(), new Date(), city.id],
                    function (error) {
                        if (error) {
                          return console.log(error.message);
                        }
                      })
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
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });
})
}