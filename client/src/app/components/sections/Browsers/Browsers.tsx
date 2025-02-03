"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { useGetBrowsers } from "../../../hooks/useGetBrowsers";

export function Browsers() {
  const { data, isLoading } = useGetBrowsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Browsers</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:px-6 sm:pt-6 flex flex-col gap-2">
        {data?.data?.slice(0, 10).map((e) => (
          <div key={e.browser} className="relative">
            <div
              className="absolute inset-0 bg-red-500 py-2 opacity-50"
              style={{ width: `${e.percentage}%` }}
            ></div>
            <div className="relative z-10 ml-1 flex justify-between items-center">
              <div>{e.browser || "Other"}</div>
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
