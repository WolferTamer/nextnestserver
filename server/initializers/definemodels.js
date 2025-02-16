const {sequelize} = require("../db")
const Sequelize = require("sequelize")
module.exports = () => {
    const city = sequelize.define('city', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull:false
        },
        state: {
            type: Sequelize.STRING,
            allowNull:false
        },
        statecode: {
            type: Sequelize.STRING,
            allowNull: false
        },
        density: {
        type: Sequelize.FLOAT,
        allowNull: false
        },
        growth: {
        type: Sequelize.FLOAT,
        allowNull:false
        },
        population: {
            type: Sequelize.INTEGER,
            allowNull:false
        },
        lat: {
        type: Sequelize.FLOAT,
        allowNull:false
        },
        lon: {
        type: Sequelize.FLOAT,
        allowNull:false
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['name', 'state']
            }
        ]
    })

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
        },
        localtaxes: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            default: false
        },
        singlestandarddeduction: {
            type: Sequelize.INTEGER
        },
        marriedstandarddeduction: {
            type: Sequelize.INTEGER
        }
    })
    //Set the foreign key to associate city with tax info
    city.hasOne(tax, {
        foreignKey: {
            allowNull: false
        }
    })
    tax.belongsTo(city)

    const incometax = sequelize.define('incometax', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        }, 
        bracket: {
            type: Sequelize.INTEGER
        },
        rate: {
            type: Sequelize.FLOAT,
            allowNull: false,
            default: 0
        },
        married: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            default: false
        }
    })

    const weather = sequelize.define('weather', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        jantemp: {
            type: Sequelize.FLOAT,
            allowNull:true
        },
        janhumidity: {
            type: Sequelize.FLOAT,
            allowNull:true
        },
        janprecipitation: {
            type: Sequelize.FLOAT,
            allowNull:true
        },
        janwind: {
            type: Sequelize.FLOAT,
            allowNull:true
        },
        janclouds: {
            type: Sequelize.FLOAT,
            allowNull:true
        },
        julytemp: {
            type: Sequelize.FLOAT,
            allowNull:true
        },
        julyhumidity: {
            type: Sequelize.FLOAT,
            allowNull:true
        },
        julyprecipitation: {
            type: Sequelize.FLOAT,
            allowNull:true
        },
        julyclouds: {
            type: Sequelize.FLOAT,
            allowNull:true
        },
        julywind: {
            type: Sequelize.FLOAT,
            allowNull:true
        }
    })
    //Set the foreign key to associate city with weather info
    city.hasOne(weather, {
        foreignKey: {
            allowNull: false
        }
    })
    weather.belongsTo(city)

    const user = sequelize.define('user', {
        userid: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    sequelize.sync({alter: true})
}