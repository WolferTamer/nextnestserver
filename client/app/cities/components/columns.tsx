"use client";

import { Button } from "@/components/ui/button";
import { components } from "@/app/types/api";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

type City = components["schemas"]["ManyCitiesResponse"]["cities"][0];

export const columns: ColumnDef<City>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex flex-row"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4 hover:cursor-pointer" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex flex-row"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4 hover:cursor-pointer" />
        </Button>
      );
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex flex-row"
        >
          <div>State</div>
          <ArrowUpDown className="ml-2 h-4 w-4 hover:cursor-pointer" />
        </Button>
      );
    },
  },
  {
    accessorKey: "density",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex flex-row"
        >
          Density
          <ArrowUpDown className="ml-2 h-4 w-4 hover:cursor-pointer" />
        </Button>
      );
    },
  },
  {
    header: "Growth",
    accessorFn: (v) => `${Math.round(1000 * v.growth) / 10}%`,
  },
  {
    accessorKey: "population",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex flex-row"
        >
          Population
          <ArrowUpDown className="ml-2 h-4 w-4 hover:cursor-pointer" />
        </Button>
      );
    },
  },
];
