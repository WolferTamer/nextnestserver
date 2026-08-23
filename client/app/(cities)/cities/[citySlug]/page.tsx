"use client";
import { useParams } from "next/navigation";
import SelectedCity from "../components/SelectedCity";
import { useCity } from "../useCities";

function City() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const { data, isLoading, error } = useCity(parseInt(citySlug));
  return <SelectedCity city={data} isLoading={isLoading} error={error} />;
}

export default City;
