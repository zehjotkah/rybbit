"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { round } from "lodash";
import { SquareArrowOutUpRight } from "lucide-react";
import { memo, ReactNode, useMemo } from "react";
import {
  SingleColResponse,
  useSingleCol,
} from "../../../../api/analytics/useSingleCol";
import { addFilter, FilterParameter } from "../../../../lib/store";
import { formatter } from "../../../../lib/utils";

const Skeleton = memo(() => {
  // Generate widths following Pareto principle with top item at 100%
  const widths = Array.from({ length: 10 }, (_, i) => {
    if (i === 0) {
      // First item always has 100% width
      return 100;
    } else if (i === 1) {
      // Second item gets large width (60-80%)
      return 60 + Math.random() * 20;
    } else {
      // Remaining 8 items get progressively smaller widths (10-40%)
      const factor = 1 - (i - 2) / 8; // Creates a declining factor from 1 to 0.125
      return 10 + factor * 30; // Creates widths from ~40% down to ~15%
    }
  });

  // Generate random widths for label and value placeholders
  const labelWidths = Array.from({ length: 10 }, (_, i) => {
    // First few items get wider labels (increased by 2.5x)
    return i < 3 ? 75 + Math.random() * 100 : 40 + Math.random() * 60;
  });

  const valueWidths = Array.from(
    { length: 10 },
    () => 20 + Math.random() * 40 // Between 20px and 60px (increased by 2.5x)
  );

  return Array.from({ length: 10 }).map((_, index) => (
    <div key={index} className="relative h-7 flex items-center">
      <div
        className="absolute inset-0 bg-neutral-800 py-2 rounded-md animate-pulse"
        style={{ width: `${widths[index]}%` }}
      ></div>
      <div className="z-10 mx-2 flex justify-between items-center text-sm w-full">
        <div className="flex items-center gap-1">
          <div
            className="h-4 bg-neutral-800 rounded animate-pulse"
            style={{ width: `${labelWidths[index]}px` }}
          ></div>
        </div>
        <div className="text-sm flex gap-2">
          <div
            className="h-4 bg-neutral-800 rounded animate-pulse"
            style={{ width: `${valueWidths[index]}px` }}
          ></div>
        </div>
      </div>
    </div>
  ));
});

export function StandardSection({
  title,
  getKey,
  getLabel,
  getValue,
  getLink,
  filterParameter,
}: {
  title: string;
  isFetching?: boolean;
  getKey: (item: SingleColResponse) => string;
  getLabel: (item: SingleColResponse) => ReactNode;
  getValue: (item: SingleColResponse) => string;
  getLink?: (item: SingleColResponse) => string;
  filterParameter: FilterParameter;
}) {
  const { data, isFetching } = useSingleCol({
    parameter: filterParameter,
  });

  const { data: previousData, isFetching: previousIsFetching } = useSingleCol({
    parameter: filterParameter,
    periodTime: "previous",
  });

  // Determine if we're in a loading state
  const isLoading = isFetching || previousIsFetching;

  const previousDataMap = useMemo(() => {
    return previousData?.data?.reduce((acc, curr) => {
      acc[getKey(curr)] = curr;
      return acc;
    }, {} as Record<string, SingleColResponse>);
  }, [previousData]);

  const ratio = data?.data?.[0]?.percentage
    ? 100 / data?.data?.[0]?.percentage
    : 1;

  return (
    <div className="flex flex-col gap-2">
      {isLoading ? (
        <Skeleton />
      ) : (
        data?.data?.slice(0, 10).map((e) => (
          <div
            key={getKey(e)}
            className="relative h-7 flex items-center cursor-pointer hover:bg-neutral-850 group"
            onClick={() =>
              addFilter({
                parameter: filterParameter,
                value: [getValue(e)],
                type: "equals",
              })
            }
          >
            <div
              className="absolute inset-0 bg-accent-400 py-2 opacity-30 rounded-md"
              style={{ width: `${e.percentage * ratio}%` }}
            ></div>
            <div className="z-10 mx-2 flex justify-between items-center text-sm w-full">
              <div className="flex items-center gap-1">
                {getLabel(e)}
                {getLink && (
                  <a
                    href={getLink(e)}
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
              <div className="text-sm flex gap-2">
                <div className="hidden group-hover:block text-neutral-400">
                  {round(e.percentage, 1)}%
                </div>
                <div>{formatter(e.count)}</div>
                {/* <div>
                    {previousDataMap?.[getKey(e)]?.percentage ? (
                      <div className="text-sm flex gap-2">
                        <div>
                          {round(
                            e.percentage -
                              (previousDataMap?.[getKey(e)]?.percentage || 0),
                            1
                          )}
                          %
                        </div>
                      </div>
                    ) : null}
                  </div> */}
              </div>
            </div>
          </div>
        ))
      )}
      {isLoading ? (
        // Skeleton for "View All" button when loading
        <Button variant="outline" disabled className="opacity-50">
          View All
        </Button>
      ) : data?.data?.length && data?.data?.length > 10 ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View All</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] w-[1000px]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 max-h-[90vh] overflow-x-hidden">
              {data?.data?.map((e) => (
                <div
                  key={getKey(e)}
                  className="relative flex items-center mr-3 cursor-pointer hover:bg-neutral-850 "
                  onClick={() =>
                    addFilter({
                      parameter: filterParameter,
                      value: [getValue(e)],
                      type: "equals",
                    })
                  }
                >
                  <div
                    className="absolute inset-0 bg-accent-400 py-2 opacity-30 rounded-md"
                    style={{ width: `${e.percentage * ratio}%` }}
                  ></div>
                  <div className="z-10 ml-2 mr-4 flex justify-between items-center text-sm w-full h-7">
                    <div className="flex items-center gap-1">
                      {getLabel(e)}
                      {getLink && (
                        <a
                          href={getLink(e)}
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
                    <div className="text-sm flex">
                      <div>{e.count.toLocaleString()}</div>
                      <div className="mx-2 bg-neutral-400 w-[1px] rounded-full h-5"></div>
                      <div className="w-10 text-neutral-400">
                        {round(e.percentage, 2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
