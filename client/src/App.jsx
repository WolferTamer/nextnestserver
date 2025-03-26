// client/src/App.js

import React from "react";
import logo from "/vite.svg";
import "./App.css";
import "./City.css"
import 'react-bootstrap-typeahead/css/Typeahead.css'; 
import Routing from "./Routes"
import Cities from "./pages/Cities";
import Navigation from './Navigation'
import Container from "react-bootstrap/esm/Container";

function App() {

  return (
    <>
      <header>
        <Navigation/>
      </header>
      <Container>
        <Routing />
      </Container>
    </>
  );
}

export default App;