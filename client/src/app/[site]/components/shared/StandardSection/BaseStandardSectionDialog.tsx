import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { round } from "lodash";
import { SquareArrowOutUpRight, Search } from "lucide-react";
import { ReactNode, useState } from "react";
import { SingleColResponse } from "../../../../../api/analytics/useSingleCol";
import { addFilter, FilterParameter } from "../../../../../lib/store";
import { Input } from "@/components/ui/input";

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

  if (!data || data.length === 0) return null;

  const labelFnToUse = getFilterLabel || getValue;

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    const label =
      typeof labelFnToUse(item) === "string"
        ? (labelFnToUse(item) as string)
        : labelFnToUse(item);

    return String(label).toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View All</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] w-[calc(100vw-2rem)] p-2 sm:p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 max-h-[calc(80vh-80px)] overflow-hidden ">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder={`Filter ${data.length} items...`}
              className="pl-9 bg-neutral-900 border-neutral-700 focus-visible:ring-accent-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2 justify-between text-sm text-neutral-400 pr-4 md:pr-20">
            <div>{title}</div>
            <div>{countLabel || "Sessions"}</div>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden max-h-[calc(80vh-150px)]">
            {filteredData.length > 0 ? (
              filteredData.map((e) => (
                <div
                  key={getKey(e)}
                  className="relative flex items-center mr-1 cursor-pointer hover:bg-neutral-850"
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
                    style={{ width: `${Math.min(e.percentage * ratio, 100)}%` }}
                  ></div>
                  <div className="z-5 ml-2 mr-2 md:mr-4 flex justify-between items-center text-xs w-full min-h-6 py-1">
                    <div className="flex items-center gap-1 min-w-0 max-w-[65%]">
                      <div className="truncate">{getLabel(e)}</div>
                      {getLink && (
                        <a
                          href={getLink(e)}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0"
                        >
                          <SquareArrowOutUpRight
                            className="w-3 h-3 text-neutral-300 hover:text-neutral-100"
                            strokeWidth={3}
                          />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-shrink-0">
                      <div>{e.count.toLocaleString()}</div>
                      <div className="mx-2 bg-neutral-400 w-[1px] rounded-full h-5"></div>
                      <div className="w-10 text-neutral-400">
                        {round(e.percentage, 2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-neutral-400">
                No results match your search
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
