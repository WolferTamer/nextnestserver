// client/src/App.js

import React from "react";
import logo from "/vite.svg";
import "./App.css";

function App() {
  const [info, setData] = React.useState(null);
  React.useEffect(() => {
    fetch("/api")
      .then((res) => {console.log(res); return res.json()})
      .then((data) => {
        setData(data.message)
        console.log("set data")
  });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!info ? "Loading..." : info}</p>
      </header>
    </div>
  );
}

export default App;