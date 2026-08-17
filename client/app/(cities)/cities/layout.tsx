"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LucideListCollapse, LucideX, Menu } from "lucide-react";
import CityMap from "./components/CityMap";

const CitiesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="w-full flex-body flex flex-col">
        <div className="flex flex-row w-full flex-header bg-secondary">
          Header
        </div>

        <div className="md:flex md:flex-row flex-body relative">
          <CityMap />
          {open ? (
            ""
          ) : (
            <div className="absolute top-0 right-0 mt-5 mr-5">
              <Button className="size-16" onClick={() => setOpen(true)}>
                <Menu className="size-12" />
              </Button>
            </div>
          )}
          <div
            className={`md:flex-footer h-full md:h-auto absolute top-0 left-0 z-10 md:z-0 md:static flex flex-col ${open ? "" : "hidden"}`}
          >
            <div className="flex-header self-end p-5">
              <Button className="size-12" onClick={() => setOpen(false)}>
                <Menu className="size-8" />
              </Button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </APIProvider>
  );
};

export default CitiesLayout;
