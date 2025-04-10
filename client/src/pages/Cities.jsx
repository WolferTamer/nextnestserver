// client/src/App.js

import React from "react";
import logo from "/vite.svg";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Filter from "../components/Filter";
import MetaData from "../components/MetaData";

const Cities = () => {
  const [info, setData] = React.useState([]);
  const [sorting,setSorting] = React.useState({ key: 'id', ascending: false })
  
  const manageData = (key) => {
    
  }

  React.useEffect(() => {
    fetch("/api/city")
      .then((res) => {console.log("Result: ", res); return res.json()})
      .then((data) => {
        console.log("Data: ", data)
        setData(data.cities)
    
  });
  }, []);
  React.useEffect(() => {
    // Copy array to prevent data mutation
    const infoCopy = [...info];
    console.log(sorting.key)

    // Apply sorting
    const sortedInfo = infoCopy.sort((a, b) => {
      if(typeof a[sorting.key] === 'number') return a[sorting.key] - b[sorting.key];
      return a[sorting.key].localeCompare(b[sorting.key]);
    });

    // Replace currentUsers with sorted currentUsers
    setData(
      // Decide either currentUsers sorted by ascending or descending order
      sorting.ascending ? sortedInfo : sortedInfo.reverse()
    );
  }, [sorting]);

  let navigate = useNavigate(); 

  function applySorting(key, ascending) {
    setSorting({ key: key, ascending: ascending });
  }

  const filterCities = (e) => {
    setData(e)
  }

  return (
    <div className="cities">
      <Filter filterCities={filterCities}/>
      {!info[0] ? (<p>Loading...</p>) : (<table id="cities-table"><tbody>
        {<tr key="header">
          {Object.keys(info[0]).map((key) => {if(MetaData[key] && MetaData[key].forceinclude) {return (
            <th onClick={() => { console.log("clicked"); applySorting(key, !sorting.ascending)}} key={key}>
              {MetaData[key].name}
              {(<FontAwesomeIcon icon={sorting.ascending ? faChevronDown : faChevronUp} visibility={sorting.key === key ? "visible" : "hidden"}/>)}
              </th>
          )}
          return ""})}
        </tr>}

        {info.map((item) => (
        <tr key={item.id} onClick={() => { navigate(`/city/${item.id}`)}}>
          {Object.keys(item).map((key) => {if(MetaData[key] && MetaData[key].forceinclude) {return (
            <td key={`${item.id}.${key}`}>{MetaData[key].prefix+(MetaData[key].operator ? MetaData[key].operator(item[key]) : item[key])+MetaData[key].suffix}</td>
          )}
          return ""})}
        </tr>
      ))}
      </tbody></table>)}
    </div>
  );
}

export default Cities;