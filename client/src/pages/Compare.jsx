//Navigated to from city
//2 IDS, each city is compared.
//Table in the format that plan comparisons usually do
//Start with just building the table, then add navigation & customizability
// client/src/App.js
import { useParams } from 'react-router-dom';
import React from "react";
import "../App.css";
import "../City.css"
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function kToF(x) {
  return ((x - 273.15)*(9/5) + 32).toFixed(1);
}
const Compare = () => {
  const { idA, idB } = useParams();
  const [cityA, setCityA] = React.useState(null);
  const [cityB, setCityB] = React.useState(null);
  const [taxA, setTaxA] = React.useState(null)
  const [taxB, setTaxB] = React.useState(null)
  const [weatherA, setWeatherA] = React.useState(null)
  const [weatherB, setWeatherB] = React.useState(null)
  const [cityName, setName] = React.useState(null)
  
  React.useEffect(() => {
    // Fetch product data using the ID
    fetch(`/api/city?id=${idA}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setCityA({error:"No City Info"})
          return;
        }
        let cityA = data.cities[0]
        setName(cityA.name)
        let filteredData = {
          "State:": cityA["state"],
          "Population:": numberWithCommas(cityA["population"]),
          "Density:": `${cityA["density"]} per mile^2`,
          "Growth:": `${cityA["growth"]*100}%`,
          "Lattitude:": cityA["lat"],
          "Longitude:": cityA["lon"]
        }
        setCityA(filteredData);
      })
      .catch((e) => {
        console.log(e)
      });
  }, [idA]);

  React.useEffect(() => {
    // Fetch product data using the ID
    fetch(`/api/tax?id=${idA}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setTaxA({error:"No Tax Info"})
          return;
        }
        let tax = data.taxes[0]
        
        let filteredData = {
          "Sales Tax:": `${tax.salestax*100 || `No Data`}%`,
          "Property Tax 25th Percentile:": `${tax.propertytaxquarter*100 || `No Data`}%`,
          "Property Tax 75th Percentile:": `${tax.propertytaxthreequarters*100 || `No Data`}%`
        }
        setTaxA(filteredData)
      });
  }, [idA]);

  React.useEffect(() => {
    // Fetch product data using the ID
    fetch(`/api/weather?id=${idA}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setWeatherA({error:"No Weather Info"})
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
        setWeatherA(filteredData)
    });
  }, [idA]);

  return (
    <div className="city">
      <header className="city-header">
        <h1>
          {!cityA ? (<p>Loading</p>): cityA.error ? (<p>{cityA.error}</p>): cityName}
        </h1>
      </header>
      {!cityA ? (<p>Loading</p>): cityA.error ? (<p>"404 Not Found"</p>): 
      (<table id="citya-table">
        <caption>cityA</caption>
        <tbody>
          
          
            {Object.keys(cityA).map((key) => (
              <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td>{cityA[key]}</td>
              </tr>
            ))}
        </tbody>
      </table>)}
      {!taxA ? (<p>Loading</p>): taxA.error ? (<p>{taxA.error}</p>): 
      (<table>
        <caption>Taxes</caption>
        <tbody>
          
          <tr className='flipped-table'>
            {Object.keys(taxA).map((key) => (
              <th id={key} className='table-header flipped-table'>{key}</th>
            ))}
          </tr>
          <tr className='flipped-table'>
            {Object.values(taxA).map((key) => (
              <td className='flipped-table'>{key}</td>
            ))}
          </tr>
        </tbody>
      </table>)}
      {!weatherA ? (<p>Loading</p>): weatherA.error ? (<p>{weatherA.error}</p>): 
      (<table>
        <caption>Weather</caption>
        <tbody>
          
          <tr className='flipped-table'>
            {Object.keys(weatherA).map((key) => (
              <th id={key} className='table-header flipped-table'>{key}</th>
            ))}
          </tr>
          <tr className='flipped-table'>
            {Object.values(weatherA).map((key) => (
              <td className='flipped-table'>{key}</td>
            ))}
          </tr>
        </tbody>
      </table>)}
    </div>
  );
}

export default Compare;