"use client";

import CityList from "./components/CityList";
import { useCities } from "./useCities";

const Cities = () => {
  const { data: info, isLoading, error } = useCities();
  return error ? (
    <div>error</div>
  ) : (
    <CityList cities={info!} isLoading={isLoading} />
  );
};

export default Cities;
