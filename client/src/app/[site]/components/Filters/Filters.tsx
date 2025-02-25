import { useStore } from "../../../../lib/store";

export function Filters() {
  const { filters } = useStore();
  if (filters.length === 0) return null;

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <div
          key={filter.parameter}
          className="p-1 rounded-md bg-neutral-850 text-neutral-400 flex items-center gap-1"
        >
          <div className="text-xs">{filter.parameter}</div>
          <div className="text-xs">{filter.value}</div>
        </div>
      ))}
    </div>
  );
}
