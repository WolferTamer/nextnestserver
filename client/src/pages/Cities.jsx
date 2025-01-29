// client/src/App.js

import React from "react";
import logo from "/vite.svg";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Cities = () => {
  const [info, setData] = React.useState([]);
  const [sorting,setSorting] = React.useState({ key: 'id', ascending: false })
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

  return (
    <div className="Cities">
      <header className="Cities-header">
      {!info[0] ? (<p>Loading...</p>) : (<table id="cities-table"><tbody>
        {<tr key="header">
          {Object.keys(info[0]).map((key) => (
            <th onClick={() => { console.log("clicked"); applySorting(key, !sorting.ascending)}} key={key}>
              {key}
              {(<FontAwesomeIcon icon={sorting.ascending ? faChevronDown : faChevronUp} visibility={sorting.key === key ? "visible" : "hidden"}/>)}
              </th>
          ))}
        </tr>}

        {info.map((item) => (
        <tr key={item.id} onClick={() => { navigate(`/city/${item.id}`)}}>
          {Object.keys(item).map((key) => (
            <td key={`${item.id}.${key}`}>{item[key]}</td>
          ))}
        </tr>
      ))}
      </tbody></table>)}
      </header>
    </div>
  );
}

export default Cities;