import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'

function SearchBar( {superChange} ) {
  const [value, setValue] = useState("")
  let handleChange = (e) => {
    setValue(e.target.value)
    superChange(e.target.value)
  }
  return (
    <InputGroup>
        <Form.Control
          placeholder="City name..."
          aria-label="City Name"
          aria-describedby="basic-name"
          onChange={handleChange}
          value={value}
        />
      </InputGroup>
  );
}

export default SearchBar;