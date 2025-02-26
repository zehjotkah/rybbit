"use client";
import { Plus } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import { FilterParameter, FilterType } from "../../../../../lib/store";
import { useState } from "react";
import { sleep } from "../../../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { ValueFilter } from "./ValueFilter";

const FilterOptions: { label: string; value: FilterParameter }[] = [
  {
    label: "Path",
    value: "pathname",
  },
  {
    label: "Query",
    value: "querystring",
  },
  {
    label: "Country",
    value: "country",
  },
  {
    label: "Region",
    value: "region",
  },
  {
    label: "City",
    value: "city",
  },
  {
    label: "Device Type",
    value: "device_type",
  },
  {
    label: "Operating System",
    value: "operating_system",
  },
  {
    label: "Browser",
    value: "browser",
  },
  {
    label: "Referrer",
    value: "referrer",
  },
];

export function NewFilterButton() {
  const [selectedFilter, setSelectedFilter] = useState<{
    label: string;
    value: FilterParameter;
  } | null>(null);

  const [selectedOperator, setSelectedOperator] =
    useState<FilterType>("equals");

  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu
      onOpenChange={async (isOpen) => {
        if (!isOpen) {
          setOpen(false);
          await sleep(100);
          setSelectedFilter(null);
          setSelectedOperator("equals");
        }
      }}
      open={open}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="px-3"
          onClick={() => setOpen(true)}
        >
          <Plus />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {selectedFilter ? (
          <div className="flex flex-col gap-2 p-2">
            <div>{selectedFilter.label}</div>
            <div className="flex items-center gap-2 text-sm">
              <Select
                onValueChange={(value) =>
                  setSelectedOperator(value as FilterType)
                }
                value={selectedOperator}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Is</SelectItem>
                  <SelectItem value="not_equals">Is not</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="not_contains">Not contains</SelectItem>
                </SelectContent>
              </Select>

              <ValueFilter
                parameter={selectedFilter.value}
                type={selectedOperator}
                onComplete={() => setOpen(false)}
              />
            </div>
          </div>
        ) : (
          FilterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={(e) => {
                e.preventDefault();
                setSelectedFilter(option);
              }}
            >
              {option.label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
