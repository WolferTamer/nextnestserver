"use client";
import CityListItem from "./CityListItem";
import { components } from "@/app/types/api";
import Paginator from "@/components/layout/Paginator";
import { LoaderCircleIcon } from "@/components/ui/loader-circle";
import { useSearchParams } from "next/navigation";

interface CityListProps {
  className?: string;
  isLoading: boolean;
  cities?: components["schemas"]["City"][];
}
function CityList({ className, cities, isLoading }: CityListProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "0");
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
          <Paginator
            current={page}
            max={Math.floor(cities.length / 20)}
            className="flex-footer"
            path={`/cities?${searchParams.toString()}`}
          />
        </>
      )}
    </div>
  );
}

export default CityList;
