"use client";

import { useCities } from "../useCities";
import { CityTable } from "../components/CityTable";
import { columns } from "../components/columns";

const CitiesTablePage = () => {
  const { data: info, isLoading, error } = useCities();
  /*const [info, setData] = React.useState<City[]>([]);
  const [sorting,setSorting] = React.useState({ key: 'id', ascending: false })
  
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

  function applySorting(key, ascending) {
    setSorting({ key: key, ascending: ascending });
  }

  const filterCities = (e) => {
    setData(e)
  }*/

  return (
    <div className="cities">
      {isLoading || error || !info ? (
        <p>Loading...</p>
      ) : (
        <CityTable columns={columns} data={info}></CityTable>
      )}
    </div>
  );
};

export default CitiesTablePage;
