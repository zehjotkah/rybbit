"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { useGetPages } from "../../../hooks/useGetPages";

export function Pages() {
  const { data, isLoading } = useGetPages();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pages</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {data?.data?.slice(0, 10).map((e) => (
          <div key={e.pathname} className="relative">
            <div
              className="absolute inset-0 bg-red-500 py-2 opacity-50"
              style={{ width: `${e.percentage}%` }}
            ></div>
            <div className="relative z-10 ml-1 flex justify-between items-center">
              <div>{e.pathname || "Other"}</div>
              <div className="text-sm flex">
                <div>{e.count}</div>
                <div className="ml-1 text-neutral-500">|</div>
                <div className="ml-1 w-10 text-neutral-500">
                  {e.percentage}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
