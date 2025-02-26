import { countries } from "countries-list";
import { X } from "lucide-react";
import {
  Filter,
  FilterParameter,
  removeFilter,
  useStore,
} from "../../../../../lib/store";
import { NewFilterButton } from "./NewFilterButton";

function getParameterNameLabel(parameter: FilterParameter) {
  switch (parameter) {
    case "country":
      return "Country";
    case "device_type":
      return "Device Type";
    case "operating_system":
      return "Operating System";
    case "browser":
      return "Browser";
    case "referrer":
      return "Referrer";
    case "pathname":
      return "Pathname";
    case "page_title":
      return "Page Title";
    case "querystring":
      return "Query String";
    default:
      return parameter;
  }
}

function getParameterValueLabel(filter: Filter) {
  switch (filter.parameter) {
    case "country":
      return (
        countries[filter.value as keyof typeof countries]?.name ?? filter.value
      );
    default:
      return filter.value;
  }
}

export function Filters() {
  const { filters } = useStore();

  return (
    <div className="flex gap-2">
      <NewFilterButton />
      {filters?.map((filter) => (
        <div
          key={filter.parameter}
          className="px-2 py-1 rounded-md bg-neutral-850 text-neutral-400 flex items-center gap-1 text-sm"
        >
          <div className="text-neutral-300">
            {getParameterNameLabel(filter.parameter)}
          </div>
          <div className="text-emerald-400 font-medium">is</div>
          <div className="text-neutral-100 font-medium">
            {getParameterValueLabel(filter)}
          </div>
          <div
            className="text-neutral-400 cursor-pointer hover:text-neutral-200"
            onClick={() => removeFilter(filter)}
          >
            <X size={16} strokeWidth={3} />
          </div>
        </div>
      ))}
    </div>
  );
}
