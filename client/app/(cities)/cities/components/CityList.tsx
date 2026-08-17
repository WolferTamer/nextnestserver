"use client";
import { Button } from "@/components/ui/button";
import CityListItem from "./CityListItem";
import { X } from "lucide-react";
import { components } from "@/app/types/api";
import { useMap } from "@vis.gl/react-google-maps";
import Pagination from "@/components/layout/Pagination";
import { useState } from "react";

interface CityListProps {
  className?: string;
  cities: components["schemas"]["City"][];
}
function CityList({ className, cities }: CityListProps) {
  const [page, setPage] = useState<number>(0);
  const changePage = (ind: number) => {
    setPage(ind);
  };
  return (
    <div
      className={`flex-body p-3 flex flex-col bg-background justify-around gap-5 w-full md:w-auto ${className}`}
    >
      <ul className="flex-body min-h-0 overflow-x-hidden overflow-y-auto">
        {cities
          .slice(page * 20, Math.min((page + 1) * 20, cities.length))
          .map((v, i) => (
            <CityListItem key={v.name + v.statecode} city={v} />
          ))}
      </ul>
      <Pagination
        current={page}
        max={cities.length / 20}
        changePage={changePage}
        className="flex-footer"
      />
    </div>
  );
}

export default CityList;
