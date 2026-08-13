"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { components } from "@/app/types/api";

interface CityListProps {
  className?: string;
  city: components["schemas"]["City"];
  onClickClose: (id: number | undefined) => void;
}
function SelectedCity({ className, city, onClickClose }: CityListProps) {
  return (
    <div className={`p-3 flex-col bg-background w-full md:w-auto ${className}`}>
      <div className="flex-header">
        <Button
          className="aspect-square"
          onClick={() => onClickClose(undefined)}
        >
          <X></X>
        </Button>
      </div>
      <div className="flex-body">{city.name}</div>
    </div>
  );
}

export default SelectedCity;
