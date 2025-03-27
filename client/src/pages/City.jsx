// client/src/App.js
import { useParams } from 'react-router-dom';
import React from "react";
import Form from 'react-bootstrap/Form';
import "../App.css";
import "../City.css"
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table'
import { Hint, Typeahead } from 'react-bootstrap-typeahead';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function kToF(x) {
  return ((x - 273.15)*(9/5) + 32).toFixed(1);
}
const City = () => {
  let cookies = new Cookies()
  const token = localStorage.getItem('token')
  const { id } = useParams();
  const [city, setCity] = React.useState(null);
  const [tax, setTax] = React.useState(null)
  const [weather, setWeather] = React.useState(null)
  const [cityName, setName] = React.useState(null)
  const [incometax, setIncomeTax] = React.useState(null)
  const [cityList, setCityList] = React.useState([])

  React.useEffect(() => {
    // Fetch product data using the ID
    fetch("/api/city")
      .then((res) => res.json())
      .then((data) => {
        let list = []
        for(const city of data.cities) {
          list.push({label:city.name,value:city.id})
        }
        list.sort((a, b) => a.label.localeCompare(b.label));
        setCityList(list)
      })
  }, [])

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
        let map = (
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API} onLoad={() => console.log('Maps API has loaded.')}>
          <Map
          defaultZoom={5}
          defaultCenter={ { lat: city["lat"], lng: city["lon"] }}
          containerStyle={{ position: 'relative', width: '100%', height: '200px'}}
          onCameraChanged={ (ev) =>
            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
          }/>
        </APIProvider>)
        let filteredData = {
          "State:": city["state"],
          "Population:": numberWithCommas(city["population"]),
          "Density:": `${city["density"]} per mile^2`,
          "Growth:": `${city["growth"]*100}%`,
          "Location:": map
        }
        setCity(filteredData);
        if(!token) { 
          setIncomeTax({error: "No Salary Info"})
          return;
         }
         let headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      let salary = localStorage.getItem("salary")
      if(!salary) {return}
      fetch(`/api/incometax?state=${filteredData["State:"]}`, {method:"get",headers: headers})
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          setIncomeTax({error:"No Income Info"})
          return;
        }

        if(data.incometaxes && data.incometaxes.length <= 0) {
          setIncomeTax({error:"No Income Info"})
          return;
        }
        let tax = data.incometaxes[0]
        
        for(let i = 1; i < data.incometaxes.length; i++) {
          if(data.incometaxes[i].bracket > salary) {
            tax = data.incometaxes[i-1]
          }
        }

        let filteredData = {
          "Bracket:": `$${tax.bracket}`,
          "Rate:": `${tax.rate}%`,
        }
        setIncomeTax(filteredData)
      });
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
  let navigate = useNavigate()
  let onSelect = (e) => {
    let id = e[0].value
    navigate(`${id}`)
  }

  return (
    
      <div className="city">
        <header className="city-header">
          <h1>
            {!city ? (<p>Loading</p>): city.error ? (<p>{city.error}</p>): cityName}
          </h1>
        </header>
        <Table responsive striped id="compare-table">
      <tbody>
        <tr className='thead-dark'>
          <th></th>
          <th>{!city ? (<p>Loading</p>): city.error ? (<p>"404 Not Found"</p>): cityName}
          </th>
          <th>{cityList.length < 1 ? (<p>Loading</p>): (<Form>
                    <Typeahead id="select-city-2" options={cityList} onChange={onSelect}
                    placeholder='Choose a city...'
                    renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
                      return (
                        <Hint>
                          
                            <Form.Control
                              {...inputProps}
                              ref={(node) => {
                                inputRef(node);
                                referenceElementRef(node);
                              }}
                            />
                        </Hint>
                      );
                    }}/>
                  </Form>
                )}</th>
        </tr>
      {!city ? (<p>Loading</p>): city.error ? (<p>"404 Not Found"</p>): 
        Object.keys(city).map((key) => (
              <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td height={key !== "Location:" ? "" : "200px"}>{city[key]}</td>
                <td></td>
                <></>
              </tr>
            ))}
      <tr className='thead-dark'>
        <th colSpan={3}>Taxes</th>
      </tr>
      {!tax ? (<p>Loading</p>): tax.error ? (<p>{tax.error}</p>): 
      Object.keys(tax).map((key) => (
              <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td>{tax[key]}</td>
                <td></td>
                <></>
              </tr>
            ))}
      <tr className='thead-dark'>
        <th colSpan={3}>Weather</th>
      </tr>
      {!weather ? (<p>Loading</p>): weather.error ? (<p>{weather.error}</p>): 
      Object.keys(weather).map((key) => (
              <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td>{weather[key]}</td>
                <td></td>
                <></>
              </tr>
            ))}
            {!incometax || incometax.error ? "" : (
          <tr className='thead-dark'>
            <th colSpan={3}>Income Tax</th>
          </tr>
        
      )}
      {!incometax || incometax.error ? "" : (
        Object.keys(incometax).map((key) => (
          <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td>{incometax[key]}</td>
                <td></td>
                <></>
          </tr>
        ))
      )}
        </tbody>
      </Table>
      </div>
  );
}

//TODO: Implement Form.Select to allow the user to choose a city to compare with the current one. 


export default City;