"use client";

import { useState, useEffect } from "react";

import { Button } from "../../../../../components/ui/button";

import { Check, ChevronsUpDown, Plus, X } from "lucide-react";

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

import { useRouter } from "next/navigation";

interface ValueFilterProps {
  parameter?: FilterParameter;

  type?: "equals" | "not_equals" | "contains" | "not_contains";

  onComplete?: () => void;
}

export function ValueFilter({ parameter, type, onComplete }: ValueFilterProps) {
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const router = useRouter();

  // This would be replaced with actual data fetching based on the parameter

  useEffect(() => {
    // Mock suggestions based on parameter type

    if (parameter) {
      // In a real implementation, these would come from an API call based on the parameter

      const mockSuggestions: Record<FilterParameter, string[]> = {
        pathname: ["/", "/about", "/pricing", "/contact", "/blog"],

        query: ["utm_source=google", "ref=homepage", "campaign=spring"],

        region: ["California", "New York", "Texas", "Florida"],

        city: ["San Francisco", "New York", "Austin", "Miami"],

        country: [
          "United States",
          "United Kingdom",
          "Canada",
          "Germany",
          "Japan",
        ],

        device_type: ["desktop", "mobile", "tablet"],

        operating_system: ["Windows", "macOS", "iOS", "Android", "Linux"],

        browser: ["Chrome", "Safari", "Firefox", "Edge"],

        referrer: ["google.com", "facebook.com", "twitter.com", "direct"],
      };

      setSuggestions(mockSuggestions[parameter] || []);
    }
  }, [parameter]);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);

    setOpen(false);
  };

  const handleApply = () => {
    if (parameter && type && value.trim()) {
      // Add the filter using the store function

      addFilter({
        parameter,

        type,

        value: value.trim(),
      });

      // Reset the component

      setValue("");

      // Call the onComplete callback (if provided)

      if (onComplete) {
        onComplete();
      }

      // Refresh the page to apply the filter

      router.refresh();
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

        <PopoverContent className="w-[200px] p-0">
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
                    key={suggestion}
                    value={suggestion}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",

                        value === suggestion ? "opacity-100" : "opacity-0"
                      )}
                    />

                    {suggestion}
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
