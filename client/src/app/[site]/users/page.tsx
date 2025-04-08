"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
} from "lucide-react";
import { UsersResponse, useGetUsers } from "../../../api/analytics/users";
import { Button } from "../../../components/ui/button";
import { CountryFlag } from "../components/shared/icons/CountryFlag";
import { Browser } from "../components/shared/icons/Browser";
import { OperatingSystem } from "../components/shared/icons/OperatingSystem";
import { getCountryName } from "../../../lib/utils";
import { Smartphone, Tablet, Monitor } from "lucide-react";

// Set up column helper
const columnHelper = createColumnHelper<UsersResponse>();

export default function UsersPage() {
  const router = useRouter();
  const { site } = useParams();

  // State for server-side operations
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "last_seen", desc: true },
  ]);

  // Convert page index to 1-based for the API
  const page = pagination.pageIndex + 1;

  // Get the first sorting column
  const sortBy = sorting.length > 0 ? sorting[0].id : "last_seen";
  const sortOrder = sorting.length > 0 && !sorting[0].desc ? "asc" : "desc";

  // Fetch data
  const { data, isLoading, isError } = useGetUsers({
    page,
    pageSize: pagination.pageSize,
    sortBy,
    sortOrder,
  });

  // Define table columns
  const columns = [
    columnHelper.accessor("user_id", {
      header: "User ID",
      cell: (info) => (
        <div className="max-w-[100px] truncate">
          {info.getValue().slice(0, 10)}...
        </div>
      ),
    }),
    columnHelper.accessor("country", {
      header: "Country",
      cell: (info) => (
        <div className="flex items-center gap-1">
          <CountryFlag country={info.getValue() || ""} />
          {info.getValue() ? getCountryName(info.getValue()) : "Unknown"}
        </div>
      ),
    }),
    columnHelper.accessor("browser", {
      header: "Browser",
      cell: (info) => (
        <div className="flex items-center gap-1">
          <Browser browser={info.getValue() || "Unknown"} />
          {info.getValue() || "Unknown"}
        </div>
      ),
    }),
    columnHelper.accessor("operating_system", {
      header: "OS",
      cell: (info) => (
        <div className="flex items-center gap-1">
          <OperatingSystem os={info.getValue() || ""} />
          {info.getValue() || "Unknown"}
        </div>
      ),
    }),
    columnHelper.accessor("device_type", {
      header: "Device",
      cell: (info) => {
        const deviceType = info.getValue();
        return (
          <div className="flex items-center gap-1">
            {deviceType === "Desktop" && <Monitor className="w-4 h-4" />}
            {deviceType === "Mobile" && <Smartphone className="w-4 h-4" />}
            {deviceType === "Tablet" && <Tablet className="w-4 h-4" />}
            {deviceType || "Unknown"}
          </div>
        );
      },
    }),
    columnHelper.accessor("pageviews", {
      header: "Pageviews",
      cell: (info) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor("events", {
      header: "Events",
      cell: (info) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor("sessions", {
      header: "Sessions",
      cell: (info) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor("last_seen", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Last Seen
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div>
          {DateTime.fromSQL(info.getValue(), {
            zone: "utc",
          })
            .toLocal()
            .toLocaleString(DateTime.DATETIME_SHORT)}
        </div>
      ),
    }),
    columnHelper.accessor("first_seen", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          First Seen
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div>
          {DateTime.fromSQL(info.getValue(), {
            zone: "utc",
          })
            .toLocal()
            .toLocaleString(DateTime.DATETIME_SHORT)}
        </div>
      ),
    }),
  ];

  // Set up table instance
  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: data?.totalCount
      ? Math.ceil(data.totalCount / pagination.pageSize)
      : -1,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  const handleRowClick = (userId: string) => {
    router.push(`/${site}/user/${userId}`);
  };

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        An error occurred while fetching users data.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Users
        </h1>
      </div>

      <div className="rounded-md border border-neutral-700 bg-neutral-850">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-900 text-neutral-400 text-xs uppercase">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-4 py-3 font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-neutral-800 animate-pulse"
                  >
                    {Array.from({ length: columns.length }).map(
                      (_, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3">
                          <div className="h-4 bg-neutral-800 rounded"></div>
                        </td>
                      )
                    )}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-neutral-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const userId = row.original.user_id;
                  const href = `/${site}/user/${userId}`;

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-neutral-800 hover:bg-neutral-800 cursor-pointer group"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 relative">
                          <Link
                            href={href}
                            className="absolute inset-0 z-10"
                            aria-label={`View user ${userId}`}
                          >
                            <span className="sr-only">View user details</span>
                          </Link>
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800">
          <div className="text-sm text-neutral-400">
            Showing{" "}
            <span className="font-semibold">
              {table.getState().pagination.pageIndex * pagination.pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  pagination.pageSize,
                data?.totalCount || 0
              )}
            </span>{" "}
            of <span className="font-semibold">{data?.totalCount || 0}</span>{" "}
            users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-neutral-400">
              Page{" "}
              <span className="font-semibold">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of{" "}
              <span className="font-semibold">{table.getPageCount() || 1}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
