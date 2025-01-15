// client/src/App.js

import React from "react";
import logo from "/vite.svg";
import "../App.css";

function Weather() {
  const [info, setData] = React.useState(null);
  React.useEffect(() => {
    fetch("/api/weather")
      .then((res) => {console.log(res); return res.json()})
      .then((data) => {
        setData(data.weather)
  });
  }, []);

  return (
    <div className="Weather">
      <header className="Weather-header">
      {!info ? (<p>Loading...</p>) : (<table>
        {<tr key={"header"}>
          {Object.keys(info[0]).map((key) => (
            <th>{key}</th>
          ))}
        </tr>}

        {info.map((item) => (
        <tr key={item.id}>
          {Object.values(item).map((val) => (
            <td>{val}</td>
          ))}
        </tr>
      ))}</table>)}
      </header>
    </div>
  );
}

export default Weather;