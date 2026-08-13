"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import CityList from "./components/CityList";
import { useCities } from "./useCities";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SelectedCity from "./components/SelectedCity";

const Cities = () => {
  const { data: info, isLoading, error } = useCities();
  const [open, setOpen] = useState<boolean>(true);
  const [selectedCity, setCity] = useState<number | undefined>(undefined);

  const onClickClose = () => {
    setOpen(false);
  };

  const onSelectCity = (id: number | undefined) => {
    setCity(id);
  };
  return isLoading ? (
    <div>Loading</div>
  ) : error ? (
    <div>error</div>
  ) : (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="w-full flex-body flex flex-col">
        <div className="flex flex-row w-full flex-header bg-secondary">
          Header
        </div>

        <div className="md:flex md:flex-row flex-body relative">
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
                {(selectedCity || selectedCity == 0) && i == selectedCity ? (
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
          {open ? (
            ""
          ) : (
            <div className="absolute top-0 right-0 mt-5 mr-5">
              <Button className="size-16" onClick={() => setOpen(true)}>
                <Menu className="size-12" />
              </Button>
            </div>
          )}
          {(selectedCity || selectedCity == 0) && info ? (
            <SelectedCity
              city={info[selectedCity]}
              onClickClose={onSelectCity}
              className={`md:flex-footer h-full md:h-auto absolute top-0 left-0 z-10 md:z-0 md:static`}
            />
          ) : (
            ""
          )}
          <CityList
            cities={info!}
            className={`md:flex-footer h-full md:h-auto absolute top-0 left-0 z-10 md:z-0 md:static ${open && !(selectedCity || selectedCity == 0) ? "" : "hidden"}`}
            onClickClose={onClickClose}
            onSelectCity={onSelectCity}
          />
        </div>
      </div>
    </APIProvider>
  );
};

export default Cities;
