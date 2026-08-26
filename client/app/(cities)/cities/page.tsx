"use client";

import { useSearchParams } from "next/navigation";
import CityList from "./components/CityList";
import { useCities } from "./useCities";
import cityFilter from "@/app/utils/cityfilter";

const Cities = () => {
  const { data: info, isLoading, error } = useCities();
  const searchParams = useSearchParams();
  const salesLow = parseFloat(searchParams.get("salesLow") ?? "0");
  const salesHigh = parseFloat(searchParams.get("salesHigh") ?? "20");
  const usedCities = !info
    ? undefined
    : info.filter((v) => {
        return cityFilter(v, salesHigh, salesLow);
      });
  return error ? (
    <div>error</div>
  ) : (
    <CityList cities={usedCities} isLoading={isLoading} />
  );
};

export default Cities;
