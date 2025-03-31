import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import FormRange from 'react-bootstrap/esm/FormRange';
import Stack from 'react-bootstrap/esm/Stack';
import Form from 'react-bootstrap/Form';

function DropdownFilter() {
  let [value, setValue] = useState(50)
  let handleChange = (e) => {
    setValue(e.target.value)
  }
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Form>
            <Form.Label>Test Checkbox</Form.Label>
            <Form.Check type="checkbox" label="Test Value 1" id="test-check-1"/>
            <Form.Check type="checkbox" label="Test Value 2" id="test-check-2"/>
            <Form.Label>Test Range</Form.Label>
            <Stack direction="horizontal">
                <p>10</p>
                <Form.Range min="10" max="100" value={value} onChange={handleChange}/>
                <p>100</p>
            </Stack>
            <p>
                {value}
            </p>
            <Form.Label>Test Radio</Form.Label>
            <Form.Check type="radio" label="Test Value 1" id="test-radio-1"/>
            <Form.Check type="radio" label="Test Value 2" id="test-radio-2"/>

        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownFilter;