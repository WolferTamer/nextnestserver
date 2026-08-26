import { AdvancedMarker, Map, Pin, useMap } from "@vis.gl/react-google-maps";
import { useCities } from "../useCities";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircleIcon } from "@/components/ui/loader-circle";
import cityFilter from "@/app/utils/cityfilter";

export default function CityMap() {
  const { data: info, isLoading, error } = useCities();
  const { citySlug } = useParams<{ citySlug?: string }>();
  const searchParams = useSearchParams();
  const salesLow = parseFloat(searchParams.get("salesLow") ?? "0");
  const salesHigh = parseFloat(searchParams.get("salesHigh") ?? "20");
  const usedCities = !info
    ? undefined
    : info.filter((v) => {
        return cityFilter(v, salesHigh, salesLow);
      });

  const map = useMap();
  useEffect(() => {
    if (info && citySlug && map) {
      const city = info.find((c) => c.id == parseInt(citySlug ?? "-1"));
      if (city) {
        map.panTo({ lat: city.lat, lng: city.lon });
        map.setZoom(8);
      }
    }
  }, [citySlug, info, map]);

  return (
    <>
      {isLoading || error ? (
        <div
          className={`md:flex-body h-full md:h-auto absolute top-0 left-0 md:static w-full md:w-auto flex items-center justify-center bg-secondary`}
        >
          {error ? (
            <p className="font-heading text-3xl font-bold">
              There Was An Error
            </p>
          ) : (
            <LoaderCircleIcon className="size-32" />
          )}
        </div>
      ) : (
        <Map
          className={`md:flex-body h-full md:h-auto absolute top-0 left-0 md:static w-full md:w-auto`}
          mapId="DEMO_MAP_ID"
          defaultCenter={{
            lat: 40,
            lng: -103,
          }}
          defaultZoom={5}
          gestureHandling="greedy"
          disableDefaultUI
        >
          {usedCities?.map((v) => (
            <AdvancedMarker
              key={v.name + v.statecode}
              position={{ lat: v.lat, lng: v.lon }}
              title={v.name}
            >
              {v.id == parseInt(citySlug ?? "-1") ? (
                <Pin
                  background={"#3d6b4f"}
                  borderColor={"#27272a"}
                  glyphColor={"#27272a"}
                ></Pin>
              ) : (
                <Pin />
              )}
            </AdvancedMarker>
          ))}
        </Map>
      )}
    </>
  );
}
