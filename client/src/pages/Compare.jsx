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
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom';
import { Hint, Typeahead } from 'react-bootstrap-typeahead';
import {AdvancedMarker, APIProvider, Map, Marker, Pin} from '@vis.gl/react-google-maps';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function kToF(x) {
  return ((x - 273.15)*(9/5) + 32).toFixed(1);
}
const Compare = () => {
  const token = localStorage.getItem('token')
  const { idA, idB } = useParams();
  const [cityA, setCityA] = React.useState(null);
  const [cityB, setCityB] = React.useState(null);
  const [taxA, setTaxA] = React.useState(null)
  const [taxB, setTaxB] = React.useState(null)
  const [weatherA, setWeatherA] = React.useState(null)
  const [weatherB, setWeatherB] = React.useState(null)
  const [cityNameA, setNameA] = React.useState(null)
  const [cityNameB, setNameB] = React.useState(null)
  const [cityList, setCityList] = React.useState([])
  const [incometaxA,setIncomeTaxA] = React.useState(null)
  const [incometaxB,setIncomeTaxB] = React.useState(null)
  const [selectedA, setSelectedA] = React.useState([])
  const [selectedB, setSelectedB] = React.useState([])
  
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
          console.log(list)
          setCityList(list)
        })
    }, [])

  let navigate = useNavigate()
  let onSelectB = (e) => {
    let newCity = e[0]
    setSelectedB(e)
    if(!newCity || newCity.value == idB) {
      return
    }
    let id = newCity.value
    navigate(`/city/${idA}/${id}`)
  }
  let onSelectA = (e) => {
    let newCity = e[0]
    setSelectedA(e)
    if(!newCity || newCity.value == idA) {
      return
    }
    let id = newCity.value
    navigate(`/city/${id}/${idB}`)
  }
  
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
        let location = { lat: cityA["lat"], lng: cityA["lon"] }
        let map = (
                  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API} onLoad={() => console.log('Maps API has loaded.')}>
                  <Map
                  defaultZoom={5}
                  defaultCenter={location}
                  center={ location}
                  containerStyle={{ position: 'relative', width: '100%', height: '200px'}}
                  onCameraChanged={ (ev) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                  }>
                    <Marker
                    key={"city"}
                    position={location}>
                      <Pin/>
                    </Marker>
                  </Map>
                </APIProvider>)
        setSelectedA([{label:cityA.name, value:idA}])
        let filteredData = {
          "State:": cityA["state"],
          "Population:": numberWithCommas(cityA["population"]),
          "Density:": `${cityA["density"]} per mile^2`,
          "Growth:": `${cityA["growth"]*100}%`,
          "Location:": map
        }
        setCityA(filteredData);
        if(!token) { 
          setIncomeTaxA({error: "No Salary Info"})
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
        console.log(data)
        if(data.error || !data.incometaxes) {
          setIncomeTaxA({
            "Bracket:": `N/A`,
            "Rate:": `N/A`
          })
          return;
        }

        if(data.incometaxes && data.incometaxes.length <= 0) {
          setIncomeTaxA({
            "Bracket:": `N/A`,
            "Rate:": `N/A`
          })
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
        setIncomeTaxA(filteredData)
      });
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
        let location = { lat: cityB["lat"], lng: cityB["lon"] }
        let map = (
                  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API} onLoad={() => console.log('Maps API has loaded.')}>
                  <Map
                  defaultZoom={5}
                  defaultCenter={location}
                  center={ location}
                  containerStyle={{ position: 'relative', width: '100%', height: '200px'}}
                  onCameraChanged={ (ev) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                  }>
                    <Marker
                    key={"city"}
                    position={location}>
                      <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                    </Marker>
                  </Map>
                </APIProvider>)
        setSelectedB([{label:cityB.name,value:idB}])
        let filteredData = {
          "State:": cityB["state"],
          "Population:": numberWithCommas(cityB["population"]),
          "Density:": `${cityB["density"]} per mile^2`,
          "Growth:": `${cityB["growth"]*100}%`,
          "Location:": map
        }
        setCityB(filteredData);
        if(!token) { 
          setIncomeTaxB({error: "No Salary Info"})
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
        console.log(data)
        if(data.error || !data.incometaxes) {
          setIncomeTaxB({
            "Bracket:": `N/A`,
            "Rate:": `N/A`
          })
          return;
        }

        if(data.incometaxes && data.incometaxes.length <= 0) {
          setIncomeTaxB({
            "Bracket:": `N/A`,
            "Rate:": `N/A`
          })
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
        setIncomeTaxB(filteredData)
      });
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
          <th>{cityList.length < 1 || !cityA ? (<p>Loading</p>): (<Form>
                    <Typeahead id="select-city-2" options={cityList} onChange={onSelectA}
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
                    }}
                    selected={selectedA}/>
                  </Form>
                  
                )}
          </th>
          <th>{cityList.length < 1 || !cityB ? (<p>Loading</p>): (<Form>
                    <Typeahead id="select-city-2" options={cityList} onChange={onSelectB}
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
                    }}
                    selected={selectedB}/>
                  </Form>
                  
                )}</th>
        </tr>
      {!cityA ? (<p>Loading</p>): cityA.error ? (<p>"404 Not Found"</p>): 
        Object.keys(cityA).map((key) => (
              <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td height={key !== "Location:" ? "" : "200px"}>{cityA[key]}</td>
                <td height={key !== "Location:" ? "" : "200px"}>{!cityB ? "loading...": cityB.error ? "An Error Occured": cityB[key]}</td>
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
        {!incometaxA || incometaxA.error ? "" : (
          <tr className='thead-dark'>
            <th colSpan={3}>Income Tax</th>
          </tr>
        
      )}
      {!incometaxA || !incometaxB || (incometaxA.error && incometaxB.error) ? "" : (
        Object.keys(incometaxA).map((key) => (
          <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td>{incometaxA[key]}</td>
                <td>{incometaxB[key]}</td>
                <></>
          </tr>
        ))
      )}
        </tbody>
      </Table>
    </div>
  );
}

export default Compare;