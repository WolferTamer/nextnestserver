import { useState } from 'react';
import SearchBar from './SearchBar';
import Stack from 'react-bootstrap/Stack'
import WeatherFilter from './WeatherFilter'
import Button from 'react-bootstrap/esm/Button';

function Filter( {filterCities} ) {
  let name = ""
  let weather = 0

  let handleName = (e) => {
    name = e
  }

  let handleWeather = (e) => {
    weather = e
  }

  let search = () => {
    if((!name || name.length == 0) && weather == 0) {
      console.log("No parameters given")
      return;
    }
    fetch(`/api/search?${name && name.length > 0 ? `name=${name}`: ""}${weather > 0 ? `weather=${weather}`: ""}`)
    .then((res) => {console.log("Result: ", res); return res.json()})
    .then((data) => {
      console.log("Data: ", data)
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
    <Stack direction="horizontal">
      <SearchBar superChange={handleName}></SearchBar>
      <WeatherFilter superChange={handleWeather}/>
      <Button onClick={search}>Search</Button>
    </Stack>
  );
}

export default Filter;