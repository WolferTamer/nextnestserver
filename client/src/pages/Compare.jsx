//Navigated to from city
//2 IDS, each city is compared.
//Table in the format that plan comparisons usually do
//Start with just building the table, then add navigation & customizability
// client/src/App.js
import { useParams } from 'react-router-dom';
import React from "react";
import "../App.css";
import "../City.css"
import Table from 'react-bootstrap/Table'
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
  const [cityNameA, setNameA] = React.useState(null)
  const [cityNameB, setNameB] = React.useState(null)
  
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
        setNameA(cityA.name)
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

  React.useEffect(() => {
    // Fetch product data using the ID
    fetch(`/api/city?id=${idB}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setCityB({error:"No City Info"})
          return;
        }
        let cityB = data.cities[0]
        setNameB(cityB.name)
        let filteredData = {
          "State:": cityB["state"],
          "Population:": numberWithCommas(cityB["population"]),
          "Density:": `${cityB["density"]} per mile^2`,
          "Growth:": `${cityB["growth"]*100}%`,
          "Lattitude:": cityB["lat"],
          "Longitude:": cityB["lon"]
        }
        setCityB(filteredData);
      })
      .catch((e) => {
        console.log(e)
      });
  }, [idB]);

  React.useEffect(() => {
    // Fetch product data using the ID
    fetch(`/api/tax?id=${idB}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setTaxB({error:"No Tax Info"})
          return;
        }
        let tax = data.taxes[0]
        
        let filteredData = {
          "Sales Tax:": `${tax.salestax*100 || `No Data`}%`,
          "Property Tax 25th Percentile:": `${tax.propertytaxquarter*100 || `No Data`}%`,
          "Property Tax 75th Percentile:": `${tax.propertytaxthreequarters*100 || `No Data`}%`
        }
        setTaxB(filteredData)
      });
  }, [idB]);

  React.useEffect(() => {
    // Fetch product data using the ID
    fetch(`/api/weather?id=${idB}`)
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setWeatherB({error:"No Weather Info"})
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
        setWeatherB(filteredData)
    });
  }, [idB]);

  return (
    <div className="compare">
      <header className="compare-header">
        <h1>
          {!cityA ? (<p>Loading</p>): cityA.error ? (<p>{cityA.error}</p>): cityNameA} vs {!cityB ? (<p>Loading</p>): cityB.error ? (<p>{cityB.error}</p>): cityNameB}
        </h1>
      </header>
      <Table responsive striped id="compare-table">
      <tbody>
        <tr className='thead-dark'>
          <th>#</th>
          <th>{!cityA ? (<p>Loading</p>): cityA.error ? (<p>"404 Not Found"</p>): cityNameA}</th>
          <th>{!cityB ? (<p>Loading</p>): cityB.error ? (<p>"404 Not Found"</p>): cityNameB}</th>
        </tr>
      {!cityA ? (<p>Loading</p>): cityA.error ? (<p>"404 Not Found"</p>): 
        Object.keys(cityA).map((key) => (
              <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td>{cityA[key]}</td>
                <td>{!cityB ? "loading...": cityB.error ? "An Error Occured": cityB[key]}</td>
                <></>
              </tr>
            ))}
      <tr className='thead-dark'>
        <th colSpan={3}>Taxes</th>
      </tr>
      {!taxA ? (<p>Loading</p>): taxA.error ? (<p>{taxA.error}</p>): 
      Object.keys(taxA).map((key) => (
              <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td className={!taxB || !taxA ? "" :
                   taxA[key] > taxB[key] ?
                    "positive-compare" : "negative-compare"}>{taxA[key]}</td>
                <td className={!taxB || !taxA ? "" :
                   taxA[key] < taxB[key] ?
                    "positive-compare" : "negative-compare"}>{!taxB ? "loading...": taxB.error ? "An Error Occured": taxB[key]}</td>
                <></>
              </tr>
            ))}
      <tr className='thead-dark'>
        <th colSpan={3}>Weather</th>
      </tr>
      {!weatherA ? (<p>Loading</p>): weatherA.error ? (<p>{weatherA.error}</p>): 
      Object.keys(weatherA).map((key) => (
              <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td className={!weatherB || !weatherA ? "" :
                   weatherA[key] > weatherB[key] ?
                    "positive-compare" : "negative-compare"}>{weatherA[key]}</td>
                <td className={!weatherB || !weatherA ? "" :
                   weatherA[key] < weatherB[key] ?
                    "positive-compare" : "negative-compare"}>{!weatherB ? "loading...": weatherB.error ? "An Error Occured": weatherB[key]}</td>
                <></>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Compare;