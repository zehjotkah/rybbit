"use client";

import { useGetSessionsInfinite } from "@/hooks/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import { getCountryName } from "../../../lib/utils";

type Session = {
  session_id: string;
  user_id: string;
  country: string;
  iso_3166_2: string;
  language: string;
  device_type: string;
  browser: string;
  operating_system: string;
  referrer: string;
  last_pageview_timestamp: string;
  pageviews: number;
};

export default function SessionsPage() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetSessionsInfinite();

  // Combine all pages of data
  const flattenedData = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data || []);
  }, [data]);

  // Reference for the scroll container
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll implementation
  useEffect(() => {
    const handleScroll = () => {
      if (!tableContainerRef.current) return;

      const { scrollHeight, scrollTop, clientHeight } =
        tableContainerRef.current;

      // Load more when user scrolls to bottom (with a 200px buffer)
      if (
        scrollHeight - scrollTop - clientHeight < 200 &&
        !isFetchingNextPage &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    };

    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener("scroll", handleScroll);
      return () => {
        tableContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Column definition
  const columnHelper = createColumnHelper<Session>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("last_pageview_timestamp", {
        header: "Last Seen",
        cell: (info) => {
          const date = parseISO(info.getValue());
          return format(date, "MMM d, yyyy h:mm a");
        },
      }),
      columnHelper.accessor("pageviews", {
        header: "Pageviews",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("country", {
        header: "Country",
        cell: (info) => getCountryName(info.getValue() || "Unknown"),
      }),
      columnHelper.accessor("browser", {
        header: "Browser",
        cell: (info) => info.getValue() || "Unknown",
      }),
      columnHelper.accessor("operating_system", {
        header: "OS",
        cell: (info) => info.getValue() || "Unknown",
      }),
      columnHelper.accessor("device_type", {
        header: "Device",
        cell: (info) => info.getValue() || "Unknown",
      }),
      columnHelper.accessor("referrer", {
        header: "Referrer",
        cell: (info) => info.getValue() || "Direct",
      }),
    ],
    []
  );

  // Table instance
  const table = useReactTable({
    data: flattenedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error)
    return <div className="p-6">Error: {(error as Error).message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sessions</h1>
      <div
        ref={tableContainerRef}
        className="overflow-auto rounded-lg"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-neutral-900 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left font-medium text-gray-400 tracking-wider"
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-neutral-650">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4">
                  <div className="flex justify-center">Loading...</div>
                </td>
              </tr>
            ) : flattenedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4">
                  <div className="flex justify-center">No sessions found</div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-neutral-850 bg-neutral-900"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {isFetchingNextPage && (
          <div className="flex justify-center p-4">
            <div className="text-sm text-gray-500">
              Loading more sessions...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
