import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function TaxFilter({superChange}) {
  const [changed, setChanged] = useState(false)
  const [married, setMarried] = useState(false)
  const [localtax, setLocalTax] = useState(false)
  const [salestax, setSalesTax] = useState(7)
  const [salary, setSalary] = useState(0)
  const [incometax, setIncomeTax] = useState(15)
  useEffect(() => {
      // Fetch product data using the ID
      if(salestax != 7 || salary != 0 || incometax != 15) {
        setChanged(true)
      } else {
        setChanged(false)
      }
      let taxes = {}
      if(localtax) {
        taxes.localtax = localtax
      }
      if(salestax != 7) {
        taxes.salestax = salestax
      }
      if(married || salary != 0 || incometax != 15) {
        taxes.incometax = incometax
        taxes.married = married
        taxes.salary = salary
      }
      superChange({
        salestax:salestax,
        salary:salary,
        incometax:incometax,
        married:married,
        localtax:localtax
      })
    })

  function handleLocal(e) {
    setLocalTax(e.target.checked)
  }

  function handleMarried(e) {
    setMarried(e.target.checked)
  }

  function handleSales(e) {
    setSalesTax(e.target.value)
  }

  function handleSalary(e) {
    setSalary(e.target.value)
  }

  function handleIncome(e) {
    setIncomeTax(e.target.value)
  }

  return (
    <Dropdown className="mx-3">
      <Dropdown.Toggle variant="info" id="dropdown-basic" className={`filter-button ${changed ? "filter-button-checked" : "filter-button-unchecked"}`}>
        Taxes
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Form>
            <Form.Label>Max. Sales Tax</Form.Label>
            <Container>
              <Row>
                <Col lg="9">
                  <Form.Range min="0" max="7" step="0.1" id="salestax" value={salestax} onChange={handleSales}/>
                </Col>
                <Col lg="2">
                  <Form.Text>{salestax}%</Form.Text>
                </Col>
              </Row>
            </Container>
            <Form.Label>Income Taxes</Form.Label>
            <Form.Check label="No Local Taxes?" id="localtax" checked={localtax} onClick={handleLocal}/>
            <Form.Check label="Married?" id="married" checked={married} onClick={handleMarried}/>
            <Form.Text>Salary</Form.Text>
            <Container>
              <Row>
                <Col lg="9">
                  <Form.Range min="0" max="1500000" step="1000" id="salary" value={salary} onChange={handleSalary}/>
                </Col>
                <Col lg="2">
                <Form.Text>${salary}</Form.Text>
                </Col>
              </Row>
            </Container>
            <Form.Text>Max. Income Tax</Form.Text>
            <Container>
              <Row>
                <Col xs="9">
                  <Form.Range min="0" max="15" step="0.5" id="incometax" value={incometax} onChange={handleIncome}/>
                </Col>
                <Col xs="2">
                  <Form.Text>{incometax}%</Form.Text>
                </Col>
              </Row>
            </Container>
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default TaxFilter;