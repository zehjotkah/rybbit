"use client";

import { useMemo, useState } from "react";

import { Button } from "../../../../../components/ui/button";

import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "../../../../../lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../../components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";

import { FilterParameter, addFilter } from "../../../../../lib/store";

import { useSingleCol } from "../../../../../hooks/api";
import { countries } from "countries-list";

interface ValueFilterProps {
  parameter: FilterParameter;

  type: "equals" | "not_equals" | "contains" | "not_contains";

  onComplete?: () => void;
}

export function ValueFilter({ parameter, type, onComplete }: ValueFilterProps) {
  const { data, isLoading } = useSingleCol({ parameter, limit: 1000 });

  const [open, setOpen] = useState(false);

  const [value, setValue] = useState("");

  const suggestions = useMemo(() => {
    return (
      data?.data
        ?.map((item) => item.value)
        .filter(Boolean)
        .map((val) => {
          if (parameter === "country") {
            return {
              value: val,
              label: countries[val as keyof typeof countries].name,
            };
          }
          return {
            value: val,
            label: val,
          };
        }) || []
    );
  }, [data]);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
  };

  const handleApply = () => {
    if (parameter && type && value.trim()) {
      addFilter({
        parameter,
        type,
        value: value.trim(),
      });
      setValue("");
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[200px] justify-between text-left font-normal"
          >
            {value || "Select value..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search values..."
              value={value}
              onValueChange={setValue}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No matching results</CommandEmpty>
              <CommandGroup>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.value}
                    value={suggestion.value}
                    onSelect={handleSelect}
                  >
                    {suggestion.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button size="sm" onClick={handleApply}>
        <Plus className="h-4 w-4 mr-1" />
        Add
      </Button>
    </div>
  );
}
