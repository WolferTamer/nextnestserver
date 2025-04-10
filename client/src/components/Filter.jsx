import { useState } from 'react';
import SearchBar from './SearchBar';
import Stack from 'react-bootstrap/Stack'
import WeatherFilter from './WeatherFilter'
import Button from 'react-bootstrap/esm/Button';
import TaxFilter from './TaxFilter';

function Filter( {filterCities} ) {
  let name = ""
  let weather = 0
  let tax = {}

  let handleName = (e) => {
    name = e
  }

  let handleWeather = (e) => {
    weather = e
  }

  let handleTax = (e) => {
    tax = e
  }

  let search = () => {
    if((!name || name.length == 0) && weather == 0 && (Object.keys(tax).length<= 0)) {
      console.log("No parameters given")
      return;
    }
    let params = []
    if(name && name.length > 0) {
      params.push(`name=${name}`)
    }
    if(weather > 0) {
      params.push(`${params.length > 0 ? "&" : ""}weather=${weather}`)
    }
    if(Object.keys(tax).length > 0) {
      params.push(`${params.length > 0 ? "&" : ""}salestax=${tax.salestax/100}&localtax=${!tax.localtax}`)
      params.push(`&married=${tax.married}&maxincome=${tax.incometax}&salary=${tax.salary}`)
    }
    fetch(`/api/search?${params.join("")}`)
    .then((res) => {console.log("Result: ", res); return res.json()})
    .then((data) => {
      if(data.cities) {
        let newdata = data.cities
        for(let i = 0; i <  newdata.length; i++) {
          if(data.cities[i].weather) {
            for(let key of Object.keys(data.cities[i].weather)) {
              newdata[i][key] = data.cities[i].weather[key]
            }
          }

          if(data.cities[i].tax) {
            for(let key of Object.keys(data.cities[i].tax)) {
              newdata[i][key] = data.cities[i].tax[key]
            }
          }

          if(data.cities[i].incometax) {
            console.log(data.cities[i].incometax)
            for(let key of Object.keys(data.cities[i].incometax)) {
              newdata[i][key] = data.cities[i].incometax[key]
            }
          }
          
          delete newdata[i].weather
          delete newdata[i].tax
          delete newdata[i].incometax
        }
        filterCities(newdata)
      }
      
    }).catch((error)=> {
      console.log(error);

    })
  }
  return (
    <div className="my-3">
      <Stack direction="horizontal">
        <SearchBar superChange={handleName}></SearchBar>
        <WeatherFilter superChange={handleWeather} />
        <TaxFilter superChange={handleTax}/>
        <Button onClick={search}>Search</Button>
      </Stack>
    </div>
  );
}

export default Filter;