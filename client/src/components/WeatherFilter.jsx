import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

function WeatherFilter({superChange}) {
  const [totalVal, setTotal] = useState(0)
  const [summer, setSummer] = useState(0)
  let handleSummer = (e) => {
    if(e.target.value == summer) {
      e.checked = false
      setTotal(Math.floor(totalVal/4)*4)
      setSummer(0)
      console.log(totalVal)
      superChange(Math.floor(totalVal/4)*4)
      return;
    }
    let newTotal = totalVal + parseInt(e.target.value)-(summer)
    setSummer(parseInt(e.target.value))
    setTotal(newTotal)
    superChange(newTotal)
  }

  const [winter, setWinter] = useState(0)
  let handleWinter = (e) => {
    if(e.target.value == winter) {
      e.checked = false
      setTotal(totalVal - winter*4)
      setWinter(0)
      superChange(totalVal - winter*4)
      return;
    }
    let newTotal = totalVal + parseInt(e.target.value*4)-(winter*4)
    setWinter(parseInt(e.target.value))
    setTotal(newTotal)
    superChange(newTotal)
  }

  const [rain, setRain] = useState(0)
  let handleRain = (e) => {
    if(e.target.value == rain) {
      e.checked = false
      setTotal(totalVal - rain*16)
      setWinter(0)
      superChange(totalVal - rain*16)
      return;
    }
    let newTotal = totalVal + parseInt(e.target.value*16)-(rain*16)
    setRain(e.target.value)
    setTotal(newTotal)
    superChange(newTotal)
  }

  const [humidity, setHumidity] = useState(0)
  let handleHumidity = (e) => {
    if(e.target.value == humidity) {
      e.checked = false
      setTotal(totalVal - humidity*64)
      setHumidity(0)
      superChange(totalVal - humidity*64)
      return;
    }
    let newTotal = totalVal + parseInt(e.target.value*64)-(humidity*64)
    setHumidity(e.target.value)
    setTotal(newTotal)
    superChange(newTotal)
  }
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Weather
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Form>
            <Form.Label>Summer Temp.</Form.Label>
            <Form.Check type="radio" label="Cool" id="cool-summer" name="summer" value="1" onClick={handleSummer} checked={totalVal%4 == 1}/>
            <Form.Check type="radio" label="Moderate" id="med-summer" name="summer" value="2" onClick={handleSummer} checked={totalVal%4 == 2}/>
            <Form.Check type="radio" label="Hot" id="hot-summer" name="summer" value="3" onClick={handleSummer} checked={totalVal%4 == 3}/>

            <Form.Label>Winter Temp.</Form.Label>
            <Form.Check type="radio" label="Cold" id="cool-winter" name="winter" value="1" onClick={handleWinter} checked={Math.floor(totalVal/4)%4 == 1}/>
            <Form.Check type="radio" label="Moderate" id="med-winter" name="winter" value="2" onClick={handleWinter} checked={Math.floor(totalVal/4)%4 == 2}/>
            <Form.Check type="radio" label="Warm" id="hot-winter" name="winter" value="3" onClick={handleWinter} checked={Math.floor(totalVal/4)%4 == 3}/>

            <Form.Label>Rain</Form.Label>
            <Form.Check type="radio" label="Little" id="little-rain" name="rain" value="1" onClick={handleRain} checked={Math.floor(totalVal/16)%4 == 1}/>
            <Form.Check type="radio" label="Some" id="some-rain" name="rain" value="2" onClick={handleRain} checked={Math.floor(totalVal/16)%4 == 2}/>
            <Form.Check type="radio" label="Lots" id="lots-rain" name="rain" value="3" onClick={handleRain} checked={Math.floor(totalVal/16)%4 == 3}/>

            <Form.Label>Humidity</Form.Label>
            <Form.Check type="radio" label="Dry" id="dry-humidity" name="humidity" value="1" onClick={handleHumidity} checked={Math.floor(totalVal/64)%4 == 1}/>
            <Form.Check type="radio" label="Moderate" id="med-humidity" name="humidity" value="2" onClick={handleHumidity} checked={Math.floor(totalVal/64)%4 == 2}/>
            <Form.Check type="radio" label="Humid" id="humid-humidity" name="humidity" value="3" onClick={handleHumidity} checked={Math.floor(totalVal/64)%4 == 3}/>
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default WeatherFilter;