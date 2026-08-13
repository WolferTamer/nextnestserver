"use client";
import { Button } from "@/components/ui/button";
import CityListItem from "./CityListItem";
import { X } from "lucide-react";
import { components } from "@/app/types/api";
import { useMap } from "@vis.gl/react-google-maps";

interface CityListProps {
  className?: string;
  cities: components["schemas"]["City"][];
  onClickClose: () => void;
  onSelectCity: (id: number | undefined) => void;
}
function CityList({
  className,
  cities,
  onClickClose,
  onSelectCity,
}: CityListProps) {
  const map = useMap();
  return (
    <div className={`p-3 flex-col bg-background w-full md:w-auto ${className}`}>
      <div className="flex-header">
        <Button className="aspect-square" onClick={onClickClose}>
          <X></X>
        </Button>
      </div>
      <ul className="flex-body min-h-0 h-full overflow-x-hidden overflow-y-auto">
        {cities.map((v, i) => (
          <CityListItem
            key={v.name + v.statecode}
            city={v}
            onClick={() => {
              onSelectCity(i);

              map.setCenter({ lat: v.lat, lng: v.lon });
              map.setZoom(8);
            }}
          />
        ))}
      </ul>
    </div>
  );
}

export default CityList;
