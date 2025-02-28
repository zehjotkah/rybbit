"use client";

import { useGetSessionsInfinite } from "@/hooks/api";
import { useMemo } from "react";
import SessionsTable from "./components/SessionsTable";
import { SubHeader } from "../components/SubHeader/SubHeader";

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

  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <SubHeader />
      <SessionsTable
        data={flattenedData}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
