"use client";

import CityList from "./components/CityList";
import { useCities } from "./useCities";

const Cities = () => {
  const { data: info, isLoading, error } = useCities();
  return isLoading ? (
    <div>Loading</div>
  ) : error ? (
    <div>error</div>
  ) : (
    <CityList cities={info!} />
  );
};

export default Cities;
