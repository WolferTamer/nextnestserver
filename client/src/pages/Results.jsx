// client/src/App.js
import {useLocation} from 'react-router-dom';
import React, { useEffect } from "react";
import Card from "react-bootstrap/Card"
import "../App.css";
import cityjpg from "../assets/city.jpg"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Results() {
  const [cities, setCities] = React.useState([]);

  let location = useLocation()
  console.log(location.state.cities)

  useEffect( ()=> {
    if(location.state) {
      let nc = []
        for(let res of location.state.cities) {
            fetch(`/api/city?id=${res.id}`)
            .then((response) => response.json())
            .then((result)=> {
                nc.push(result.cities[0])
                setCities(nc)
            })
            .catch((error) => console.error(error))
        }
    }
  }, [])

  if(!location.state) {
    return (<p>No results found</p>)
  } else {
    return (
      <Container fluid="md">
        <Row>
          {cities.map((city) => {console.log(city); return (
            <Col sm={5}>
              <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={cityjpg} />
                  <Card.Body>
                  <Card.Title><a href={`/city/${city.id}`}>{city.name}</a></Card.Title>
                  <Card.Text>
                      {city.state}
                  </Card.Text>
                  </Card.Body>
              </Card>
              </Col>
          )})}
        </Row>
      </Container>
    );

  }
}

export default Results;