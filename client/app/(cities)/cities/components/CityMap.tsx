import { AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";
import { useCities } from "../useCities";
import { useParams } from "next/navigation";

export default function CityMap() {
  const { data: info, isLoading, error } = useCities();
  const { citySlug } = useParams<{ citySlug?: string }>();
  const slugNumber = parseInt(citySlug ?? "-1");

  return (
    <Map
      className="md:flex-body h-full md:h-auto absolute top-0 left-0 md:static w-full md:w-auto"
      mapId="DEMO_MAP_ID"
      defaultCenter={{
        lat: 40,
        lng: -103,
      }}
      defaultZoom={5}
      gestureHandling="greedy"
      disableDefaultUI
    >
      {info?.map((v, i) => (
        <AdvancedMarker
          key={v.name + v.statecode}
          position={{ lat: v.lat, lng: v.lon }}
          title={v.name}
        >
          {slugNumber !== -1 && i == slugNumber ? (
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
  );
}
