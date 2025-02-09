import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { useGetOverview } from "../../../hooks/api";
import { formatter } from "../../../lib/utils";

const ChangePercentage = ({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) => {
  const change = ((current - previous) / previous) * 100;

  if (change === 0) {
    return (
      <Badge variant="minimal" className="text-xs">
        0%
      </Badge>
    );
  }

  return (
    <Badge variant={change > 0 ? "green" : "red"} className="text-xs">
      {change > 0 ? "+" : ""}
      {change.toFixed(0)}%
    </Badge>
  );
};

export function Overview() {
  const {
    data: overviewData,
    isFetching: isOverviewFetching,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useGetOverview();
  const { data: overviewDataPrevious, isLoading: isOverviewLoadingPrevious } =
    useGetOverview("previous");

  const isLoading = isOverviewLoading || isOverviewLoadingPrevious;

  const currentUsers = overviewData?.data?.users ?? 0;
  const previousUsers = overviewDataPrevious?.data?.users ?? 0;

  const currentSessions = overviewData?.data?.sessions ?? 0;
  const previousSessions = overviewDataPrevious?.data?.sessions ?? 0;

  const currentPageviews = overviewData?.data?.pageviews ?? 0;
  const previousPageviews = overviewDataPrevious?.data?.pageviews ?? 0;

  return (
    <div className="flex gap-8 items-center">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-muted-foreground">
          Unique Users
        </div>
        <div className="text-3xl font-medium flex gap-2 items-center">
          {isLoading ? (
            <>
              <Skeleton className="w-[60px] h-7 rounded-md" />
              <Skeleton className="w-[30px] h-5 rounded-md" />
            </>
          ) : (
            <>
              {formatter(currentUsers)}

              <ChangePercentage
                current={currentUsers}
                previous={previousUsers}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-muted-foreground">
          Sessions
        </div>
        <div className="text-3xl font-medium flex gap-2 items-center">
          {isLoading ? (
            <>
              <Skeleton className="w-[60px] h-7 rounded-md" />
              <Skeleton className="w-[30px] h-5 rounded-md" />
            </>
          ) : (
            <>
              {formatter(currentSessions)}
              <ChangePercentage
                current={currentSessions}
                previous={previousSessions}
              />
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-muted-foreground">
          Pageviews
        </div>
        <div className="text-3xl font-medium flex gap-2 items-center">
          {isLoading ? (
            <>
              <Skeleton className="w-[60px] h-7 rounded-md" />
              <Skeleton className="w-[30px] h-5 rounded-md" />
            </>
          ) : (
            <>
              {formatter(currentPageviews)}
              <ChangePercentage
                current={currentPageviews}
                previous={previousPageviews}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
