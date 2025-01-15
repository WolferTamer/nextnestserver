// client/src/App.js

import React from "react";
import logo from "/vite.svg";
import "../App.css";

const Cities = () => {
    console.log('Hello')
  const [info, setData] = React.useState(null);
  React.useEffect(() => {
    fetch("/api/city")
      .then((res) => {console.log(res); return res.json()})
      .then((data) => {
        setData(data.cities)
  });
  }, []);

  return (
    <div className="Cities">
      <header className="Cities-header">
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

export default Cities;