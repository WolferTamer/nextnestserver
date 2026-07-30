import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import NY from "@/public/new-york-skyline.jpg";
import { Search } from "lucide-react";
export default function HomePageHeader() {
  return (
    <div className="relative w-full max-h-100 overflow-hidden bg-background flex flex-col items-center">
      <div
        style={{ backgroundImage: `url(${NY.src})` }}
        className="absolute inset-0 bg-cover bg-center
        mask-b-to-100%"
      />
      <div className="relative z-10 p-10 max-w-3xl flex flex-col items-start justify-start gap-4">
        <div className="font-heading text-4xl">
          Struggling to find your next home?
        </div>
        <div className="text-xl opacity-75">
          Answer a few questions about how you live and we&apos;ll match you
          with cities that fit your lifestyle, budget, and values.
        </div>
        <Card className="w-full">
          <CardContent className="flex flex-col gap-2">
            <div className="w-full flex flex-row justify-start items-center  gap-3">
              <InputGroup className="w-full">
                {" "}
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
              <Button>Search Cities</Button>
            </div>
            <ToggleGroup
              multiple
              size="sm"
              variant="outline"
              className="w-full flex flex-row"
            >
              <ToggleGroupItem
                value="lowcol"
                aria-label="Toggle Cost Of Living Filter"
              >
                Low COL
              </ToggleGroupItem>
              <ToggleGroupItem
                value="walkable"
                aria-label="Toggle Walkable Filter"
              >
                Walkable
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
