// client/src/App.js
import { useParams } from 'react-router-dom';
import React from "react";
import logo from "/vite.svg";
import "../App.css";
import "../City.css"
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function kToF(x) {
  return ((x - 273.15)*(9/5) + 32).toFixed(1);
}
const City = () => {
  const { id } = useParams();
  const [city, setCity] = React.useState(null);
  const [tax, setTax] = React.useState(null)
  const [weather, setWeather] = React.useState(null)
  const [cityName, setName] = React.useState(null)
  
  React.useEffect(() => {
    // Fetch product data using the ID
    fetch(`/api/city?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setCity({error:"No City Info"})
          return;
        }
        let city = data.cities[0]
        setName(city.name)
        let filteredData = {
          "State:": city["state"],
          "Population:": numberWithCommas(city["population"]),
          "Density:": `${city["density"]} per mile^2`,
          "Growth:": `${city["growth"]*100}%`,
          "Lattitude:": city["lat"],
          "Longitude:": city["lon"]
        }
        setCity(filteredData);
      })
      .catch((e) => {
        console.log(e)
      });
  }, [id]);

  React.useEffect(() => {
    // Fetch product data using the ID
    fetch(`/api/tax?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setTax({error:"No Tax Info"})
          return;
        }
        let tax = data.taxes[0]
        
        let filteredData = {
          "Sales Tax:": `${tax.salestax*100 || `No Data`}%`,
          "Property Tax 25th Percentile:": `${tax.propertytaxquarter*100 || `No Data`}%`,
          "Property Tax 75th Percentile:": `${tax.propertytaxthreequarters*100 || `No Data`}%`
        }
        setTax(filteredData)
      });
  }, [id]);

  React.useEffect(() => {
    // Fetch product data using the ID
    fetch(`/api/weather?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setWeather({error:"No Weather Info"})
          return;
        }
        let weather = data.weather[0]
        let filteredData = {
          "January Temperature:": `${kToF(weather.jantemp)} F`,
          "January Humidity:" :`${weather.janhumidity}%`,
          "January Precipitation:" :`${weather.janprecipitation} m`,
          "January Wind:" :`${weather.janwind} mph`,
          "January Clouds:" :`${weather.janclouds}%`,
          "July Temperature:": `${kToF(weather.julytemp)} F`,
          "July Humidity:" :`${weather.julyhumidity}%`,
          "July Precipitation:" :`${weather.julyprecipitation} m`,
          "July Wind:" :`${weather.julywind} mph`,
          "July Clouds:" :`${weather.julyclouds}%`
        }
        setWeather(filteredData)
    });
  }, [id]);

  return (
    <div className="city">
      <header className="city-header">
        <h1>
          {!city ? (<p>Loading</p>): city.error ? (<p>{city.error}</p>): cityName}
        </h1>
      </header>
      {!city ? (<p>Loading</p>): city.error ? (<p>"404 Not Found"</p>): 
      (<table>
        <caption>City</caption>
        <tbody>
          
          <tr>
            {Object.keys(city).map((key) => (
              <th id={key}  className='table-header'>{key}</th>
            ))}
          </tr>
          <tr>
            {Object.values(city).map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </tbody>
      </table>)}
      {!tax ? (<p>Loading</p>): tax.error ? (<p>{tax.error}</p>): 
      (<table>
        <caption>Taxes</caption>
        <tbody>
          
          <tr>
            {Object.keys(tax).map((key) => (
              <th id={key} className='table-header'>{key}</th>
            ))}
          </tr>
          <tr>
            {Object.values(tax).map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </tbody>
      </table>)}
      {!weather ? (<p>Loading</p>): weather.error ? (<p>{weather.error}</p>): 
      (<table>
        <caption>Weather</caption>
        <tbody>
          
          <tr>
            {Object.keys(weather).map((key) => (
              <th id={key} className='table-header'>{key}</th>
            ))}
          </tr>
          <tr>
            {Object.values(weather).map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </tbody>
      </table>)}
    </div>
  );
}

export default City;