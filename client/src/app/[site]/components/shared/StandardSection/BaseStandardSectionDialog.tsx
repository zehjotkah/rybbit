import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Search,
  SquareArrowOutUpRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import { SingleColResponse } from "../../../../../api/analytics/useSingleCol";
import { addFilter, FilterParameter } from "../../../../../lib/store";
import { formatSecondsAsMinutesAndSeconds } from "../../../../../lib/utils";

interface BaseStandardSectionDialogProps {
  title: string;
  data?: SingleColResponse[];
  ratio: number;
  getKey: (item: SingleColResponse) => string;
  getLabel: (item: SingleColResponse) => ReactNode;
  getValue: (item: SingleColResponse) => string;
  getFilterLabel?: (item: SingleColResponse) => string;
  getLink?: (item: SingleColResponse) => string;
  countLabel?: string;
  filterParameter: FilterParameter;
}

const columnHelper = createColumnHelper<SingleColResponse>();

export function BaseStandardSectionDialog({
  title,
  data,
  ratio,
  getKey,
  getLabel,
  getValue,
  getFilterLabel,
  getLink,
  countLabel,
  filterParameter,
}: BaseStandardSectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "count", desc: true },
  ]);

  if (!data || data.length === 0) return null;

  const labelFnToUse = getFilterLabel || getValue;

  // Filter data based on search term
  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const label =
          typeof labelFnToUse(item) === "string"
            ? (labelFnToUse(item) as string)
            : labelFnToUse(item);

        return String(label)
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      }),
    [data, labelFnToUse, debouncedSearchTerm]
  );

  const columns = useMemo(() => {
    const cols = [
      columnHelper.accessor("value", {
        header: title,
        cell: ({ row }) => (
          <div className="flex flex-row gap-1 items-center text-left">
            {getLabel(row.original)}
            {getLink && (
              <a
                href={getLink(row.original)}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <SquareArrowOutUpRight
                  className="w-3 h-3 text-neutral-300 hover:text-neutral-100"
                  strokeWidth={3}
                />
              </a>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("count", {
        header: "Sessions",
        cell: (info) => (
          <div className="text-left flex flex-row gap-1 items-center">
            {info.getValue().toLocaleString()} ({info.row.original.percentage}%)
          </div>
        ),
      }),
    ];

    const hasPageviews = data?.[0]?.pageviews !== undefined;
    if (hasPageviews) {
      cols.push(
        columnHelper.accessor("pageviews", {
          header: "Pageviews",
          cell: (info) => (
            <div className="text-left flex flex-row gap-1 items-center">
              {info.getValue()?.toLocaleString()}
              <span className="text-xs text-neutral-400">
                ({info.row.original.pageviews_percentage}%)
              </span>
            </div>
          ),
        }) as any
      );
    }

    const hasDuration = data?.[0]?.time_on_page_seconds !== undefined;
    if (hasDuration) {
      cols.push(
        columnHelper.accessor("time_on_page_seconds", {
          header: "Duration",
          cell: (info) => (
            <div className="text-left">
              {formatSecondsAsMinutesAndSeconds(
                Math.round(info.getValue() ?? 0)
              )}
            </div>
          ),
        }) as any
      );
    }
    return cols;
  }, []);

  // Set up table instance
  const table = useReactTable({
    data: filteredData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    manualSorting: false,
    sortDescFirst: true,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View All</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] w-[calc(100vw-2rem)] p-2 sm:p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 ">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder={`Filter ${data.length} items...`}
              className="pl-9 bg-neutral-900 border-neutral-700  text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-[80vh] overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-900 text-neutral-400 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="px-3 py-1 font-medium whitespace-nowrap cursor-pointer select-none"
                        style={{
                          minWidth: header.id === "user_id" ? "100px" : "auto",
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {{
                            asc: <ChevronUp className="h-3 w-3" />,
                            desc: <ChevronDown className="h-3 w-3" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-neutral-800 hover:bg-neutral-850 cursor-pointer group"
                      onClick={() =>
                        addFilter({
                          parameter: filterParameter,
                          value: [getValue(row.original)],
                          type: "equals",
                        })
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2 relative">
                          <span className="relative z-0">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
