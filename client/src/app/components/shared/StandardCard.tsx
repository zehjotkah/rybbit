"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export function StandardCard<T extends { percentage: number; count: number }>({
  title,
  data,
  getKey,
  getLabel,
}: {
  title: string;
  data:
    | {
        data?: T[];
        error?: string;
      }
    | undefined;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {data?.data?.slice(0, 10).map((e) => (
          <div key={getKey(e)} className="relative">
            <div
              className="absolute inset-0 bg-red-500 py-2 opacity-50"
              style={{ width: `${e.percentage}%` }}
            ></div>
            <div className="relative z-10 ml-1 flex justify-between items-center">
              <div>{getLabel(e)}</div>
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
