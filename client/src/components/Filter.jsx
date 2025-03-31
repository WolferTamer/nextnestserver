import { useState } from 'react';
import SearchBar from './SearchBar';
import Stack from 'react-bootstrap/Stack'
import WeatherFilter from './WeatherFilter'
import Button from 'react-bootstrap/esm/Button';

function Filter() {
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