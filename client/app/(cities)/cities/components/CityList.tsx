"use client";
import CityListItem from "./CityListItem";
import { components } from "@/app/types/api";
import Pagination from "@/components/layout/Pagination";
import { LoaderCircleIcon } from "@/components/ui/loader-circle";
import { useState } from "react";

interface CityListProps {
  className?: string;
  isLoading: boolean;
  cities?: components["schemas"]["City"][];
}
function CityList({ className, cities, isLoading }: CityListProps) {
  const [page, setPage] = useState<number>(0);
  const changePage = (ind: number) => {
    setPage(ind);
  };
  return (
    <div
      className={`flex-body p-3 flex flex-col bg-background justify-around gap-5 w-full md:w-auto ${className}`}
    >
      {isLoading || !cities ? (
        <div className="p-5 w-100 flex justify-center items-center">
          <LoaderCircleIcon className="size-32" />
        </div>
      ) : (
        <>
          <ul className="flex-body min-h-0 h-0 overflow-x-hidden overflow-y-auto">
            {cities
              .slice(page * 20, Math.min((page + 1) * 20, cities.length))
              .map((v) => (
                <CityListItem key={v.name + v.statecode} city={v} />
              ))}
          </ul>
          <Pagination
            current={page}
            max={cities.length / 20}
            changePage={changePage}
            className="flex-footer"
          />
        </>
      )}
    </div>
  );
}

export default CityList;
