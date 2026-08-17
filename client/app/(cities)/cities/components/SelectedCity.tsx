"use client";
import { ChevronLeft } from "lucide-react";
import { components } from "@/app/types/api";
import Link from "next/link";

interface CityListProps {
  className?: string;
  city: components["schemas"]["City"];
}
function SelectedCity({ className, city }: CityListProps) {
  const weather = !city.weather ? undefined : city.weather[0];

  return (
    <div
      className={`p-3 flex flex-col bg-background justify-around gap-5 w-full md:w-auto  ${className}`}
    >
      <div className="flex-body w-100 flex flex-col p-3 gap-5 overflow-auto min-h-0 ">
        <h2 className="font-bold text-2xl font-heading">
          {`${city.name}, ${city.state}`}
        </h2>
        {weather ? (
          <div>
            <h3 className="text-lg font-bold font-heading">Weather</h3>
            <br />
            <ul className="grid grid-cols-2 gap-x-2 list-disc list-inside">
              {weather.jantemp ? (
                <li>{Math.round(weather.jantemp)} Degrees Winter</li>
              ) : (
                ""
              )}
              {weather.janprecipitation ? (
                <li>{Math.round(weather.janprecipitation)} In. Prec Winter</li>
              ) : (
                ""
              )}
              {weather.julytemp ? (
                <li>{Math.round(weather.julytemp)} Degrees Summer</li>
              ) : (
                ""
              )}
              {weather.julyprecipitation ? (
                <li>{Math.round(weather.julyprecipitation)} In. Prec Summer</li>
              ) : (
                ""
              )}
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex-footer">
        <Link href="/cities">
          <ChevronLeft />
          Back
        </Link>
      </div>
    </div>
  );
}

export default SelectedCity;
