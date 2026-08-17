import { components } from "@/app/types/api";
import { taxesShortString, weatherShortString } from "@/app/utils/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { abbreviateNumber } from "@/lib/abbreviateNumber";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface CityListItemProps {
  className?: string;
  city: components["schemas"]["City"];
}
function CityListItem({ className, city }: CityListItemProps) {
  return (
    <li className={"w-100 p-5 " + className}>
      <Card className="w-full min-h-50 hover:cursor-pointer hover:border-foreground hover:shadow-primary">
        <CardHeader>
          <CardTitle>
            <Link
              href={`/cities/${city.id}`}
            >{`${city.name}, ${city.statecode}`}</Link>
          </CardTitle>
          <CardDescription>{`${abbreviateNumber(city.population)} People`}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 py-2 text-sm">
            {city.weather && city.weather.length > 0 ? (
              <li className="flex gap-2">
                <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{weatherShortString(city.weather[0])}</span>
              </li>
            ) : (
              ""
            )}

            {city.tax && city.tax.length > 0 ? (
              <li className="flex gap-2">
                <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{taxesShortString(city.tax[0])}</span>
              </li>
            ) : (
              ""
            )}
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
