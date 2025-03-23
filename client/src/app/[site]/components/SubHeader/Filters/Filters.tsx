import { X } from "lucide-react";
import {
  Filter,
  FilterParameter,
  FilterType,
  removeFilter,
  updateFilter,
  useStore,
} from "../../../../../lib/store";
import { getCountryName } from "../../../../../lib/utils";
import { NewFilterButton } from "./NewFilterButton";
import { useGetRegionName } from "../../../../../lib/geo";

function getParameterNameLabel(parameter: FilterParameter) {
  switch (parameter) {
    case "country":
      return "Country";
    case "device_type":
      return "Device Type";
    case "operating_system":
      return "OS";
    case "browser":
      return "Browser";
    case "referrer":
      return "Referrer";
    case "pathname":
      return "Path";
    case "page_title":
      return "Title";
    case "querystring":
      return "Query";
    case "language":
      return "Language";
    case "city":
      return "City";
    case "region":
      return "Region";
    case "iso_3166_2":
      return "Region";
    case "entry_page":
      return "Entry Page";
    case "exit_page":
      return "Exit Page";
    case "dimensions":
      return "Dimension";
    case "event_name":
      return "Event Name";
    default:
      return parameter;
  }
}

const filterTypeToLabel = (type: FilterType) => {
  switch (type) {
    case "equals":
      return "is";
    case "not_equals":
      return "is not";
    case "contains":
      return "contains";
    case "not_contains":
      return "not contains";
  }
};

function getParameterValueLabel(
  filter: Filter,
  getRegionName: (iso_3166_2: string) => string | undefined
) {
  const formatValue = (value: string) => {
    if (filter.parameter === "country") {
      return getCountryName(value);
    }
    if (filter.parameter === "iso_3166_2") {
      return getRegionName(value);
    }
    return value;
  };

  if (filter.value.length === 1) {
    return formatValue(filter.value[0]);
  }

  // For multiple values, format them and join with commas
  return filter.value.map(formatValue).join(", ");
}

export function Filters() {
  const { filters } = useStore();
  const { getRegionName } = useGetRegionName();

  return (
    <div className="flex gap-2">
      <NewFilterButton />
      {filters?.map((filter, i) => (
        <div
          key={filter.parameter}
          className="px-2 py-1 rounded-md bg-neutral-850 text-neutral-400 flex items-center gap-1 text-sm"
        >
          <div className="text-neutral-300">
            {getParameterNameLabel(filter.parameter)}
          </div>
          <div
            className={`text-emerald-400 font-medium cursor-pointer ${
              filter.type === "not_equals" || filter.type === "not_contains"
                ? "text-red-400"
                : ""
            }`}
            onClick={() => {
              let newType: FilterType = "equals";
              if (filter.type === "equals") {
                newType = "not_equals";
              } else if (filter.type === "not_equals") {
                newType = "contains";
              } else if (filter.type === "contains") {
                newType = "not_contains";
              } else if (filter.type === "not_contains") {
                newType = "equals";
              }

              updateFilter({ ...filter, type: newType }, i);
            }}
          >
            {filterTypeToLabel(filter.type)}
          </div>
          <div className="text-neutral-100 font-medium">
            {getParameterValueLabel(filter, getRegionName)}
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
