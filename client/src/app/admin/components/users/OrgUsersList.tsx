"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAdminUsers, AdminUserData } from "@/api/admin/getAdminUsers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  User,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/pagination";
import { authClient } from "@/lib/auth";
import { userStore } from "@/lib/userStore";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

export function OrgUsersList() {
  const router = useRouter();
  const { data: users, isLoading, isError } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const toggleExpand = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  // Filter users based on search query
  const filteredUsers = users?.filter((user) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(lowerSearchQuery) ||
      user.email.toLowerCase().includes(lowerSearchQuery) ||
      user.sites.some((site) =>
        site.domain.toLowerCase().includes(lowerSearchQuery)
      )
    );
  });

  // Define columns for the table
  const columns = useMemo<ColumnDef<AdminUserData>[]>(
    () => [
      {
        id: "expand",
        header: "",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0"
            onClick={() => toggleExpand(row.original.id)}
          >
            {expandedUsers.has(row.original.id) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            User
            {{
              asc: <ArrowUp className="ml-2 h-4 w-4" />,
              desc: <ArrowDown className="ml-2 h-4 w-4" />,
            }[column.getIsSorted() as string] ?? (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name") || "Unnamed"}</div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Email
            {{
              asc: <ArrowUp className="ml-2 h-4 w-4" />,
              desc: <ArrowDown className="ml-2 h-4 w-4" />,
            }[column.getIsSorted() as string] ?? (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => row.getValue("email"),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Role
            {{
              asc: <ArrowUp className="ml-2 h-4 w-4" />,
              desc: <ArrowDown className="ml-2 h-4 w-4" />,
            }[column.getIsSorted() as string] ?? (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => row.getValue("role"),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Created
            {{
              asc: <ArrowUp className="ml-2 h-4 w-4" />,
              desc: <ArrowDown className="ml-2 h-4 w-4" />,
            }[column.getIsSorted() as string] ?? (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) =>
          formatDistanceToNow(new Date(row.getValue("createdAt")), {
            addSuffix: true,
          }),
      },
      {
        accessorKey: "monthlyEventCount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Monthly Events
            {{
              asc: <ArrowUp className="ml-2 h-4 w-4" />,
              desc: <ArrowDown className="ml-2 h-4 w-4" />,
            }[column.getIsSorted() as string] ?? (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) =>
          (row.getValue("monthlyEventCount") as number)?.toLocaleString() || 0,
      },
      {
        id: "sites",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Sites
            {{
              asc: <ArrowUp className="ml-2 h-4 w-4" />,
              desc: <ArrowDown className="ml-2 h-4 w-4" />,
            }[column.getIsSorted() as string] ?? (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        accessorFn: (row) => row.sites.length,
        cell: ({ row }) => <Badge>{row.original.sites.length}</Badge>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            onClick={() => handleImpersonate(row.original.id)}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            disabled={row.original.id === userStore.getState().user?.id}
          >
            <User className="h-4 w-4" />
            Impersonate
          </Button>
        ),
        enableSorting: false,
      },
    ],
    [expandedUsers]
  );

  // Initialize the table
  const table = useReactTable({
    data: filteredUsers || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
  });

  // Paginate the sorted and filtered users
  const paginatedUsers = table
    .getRowModel()
    .rows.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );

  // Pagination controller for TablePagination
  const paginationController = {
    getState: () => ({ pagination }),
    getCanPreviousPage: () => pagination.pageIndex > 0,
    getCanNextPage: () =>
      table.getRowModel().rows.length > 0
        ? pagination.pageIndex <
          Math.ceil(table.getRowModel().rows.length / pagination.pageSize) - 1
        : false,
    getPageCount: () =>
      table.getRowModel().rows.length > 0
        ? Math.ceil(table.getRowModel().rows.length / pagination.pageSize)
        : 0,
    setPageIndex: (index: number) =>
      setPagination({ ...pagination, pageIndex: index }),
    previousPage: () =>
      setPagination({
        ...pagination,
        pageIndex: Math.max(0, pagination.pageIndex - 1),
      }),
    nextPage: () =>
      setPagination({
        ...pagination,
        pageIndex: Math.min(
          table.getRowModel().rows.length > 0
            ? Math.ceil(table.getRowModel().rows.length / pagination.pageSize) -
                1
            : 0,
          pagination.pageIndex + 1
        ),
      }),
  };

  // Impersonation handler
  const handleImpersonate = async (userId: string) => {
    try {
      await authClient.admin.impersonateUser({
        userId,
      });
      window.location.reload();
      router.push("/");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error(`Failed to impersonate user: ${errorMessage}`);
      return false;
    }
  };

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load organization users data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Organization Owners</h2>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search by name, email or domain..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border border-neutral-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id === "expand" ? "w-8" : ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(pagination.pageSize)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-5" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24" />
                    </TableCell>
                  </TableRow>
                ))
            ) : paginatedUsers && paginatedUsers.length > 0 ? (
              paginatedUsers.map((row) => (
                <>
                  <TableRow key={row.id} className="group">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedUsers.has(row.original.id) && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="bg-neutral-900 py-2 px-8"
                      >
                        <div className="text-sm font-semibold mb-2">Sites:</div>
                        {row.original.sites.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {row.original.sites.map((site) => (
                              <div
                                key={site.siteId}
                                className="p-3 border border-neutral-700 rounded"
                              >
                                <div className="font-medium">
                                  <Link
                                    href={`/${site.siteId}`}
                                    target="_blank"
                                    className="hover:underline"
                                  >
                                    {site.name || site.domain}
                                  </Link>
                                </div>
                                <div className="text-sm text-neutral-400 mt-1">
                                  <Link
                                    href={`https://${site.domain}`}
                                    target="_blank"
                                    className="hover:underline"
                                  >
                                    {site.domain}
                                  </Link>
                                </div>
                                <div className="text-xs text-neutral-500 mt-1">
                                  Created:{" "}
                                  {formatDistanceToNow(
                                    new Date(site.createdAt),
                                    { addSuffix: true }
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-neutral-400">No sites</div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6 text-muted-foreground"
                >
                  {searchQuery
                    ? "No users match your search"
                    : "No organization owners found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <TablePagination
          table={paginationController}
          data={
            table.getRowModel().rows.length > 0
              ? {
                  items: table.getRowModel().rows,
                  total: table.getRowModel().rows.length,
                }
              : undefined
          }
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
          itemName="users"
        />
      </div>
    </div>
  );
}
