import { components } from "@/app/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { abbreviateNumber } from "@/lib/abbreviateNumber";
import { ChevronRightIcon } from "lucide-react";

interface CityListItemProps {
  className?: string;
  city: components["schemas"]["City"];
  onClick: () => void;
}
function CityListItem({ className, city, onClick }: CityListItemProps) {
  return (
    <li className={"w-100 p-5 " + className}>
      <Card
        className="w-full min-h-50 hover:cursor-pointer hover:border-foreground hover:shadow-primary"
        onClick={onClick}
      >
        <CardHeader>
          <CardTitle>{`${city.name}, ${city.statecode}`}</CardTitle>
          <CardDescription>{`${abbreviateNumber(city.population)} People`}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 py-2 text-sm">
            <li className="flex gap-2">
              <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>Choose a schedule (daily, or weekly).</span>
            </li>
            <li className="flex gap-2">
              <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>Send to channels or specific teammates.</span>
            </li>
            <li className="flex gap-2">
              <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>Include charts, tables, and key metrics.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </li>
  );
}

export default CityListItem;
