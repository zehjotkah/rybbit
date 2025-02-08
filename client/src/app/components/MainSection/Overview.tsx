import { Badge } from "../../../components/ui/badge";
import { useGetOverview } from "../../../hooks/api";
import CountUp from "react-countup";
import { formatter } from "../../../lib/utils";

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
  const usersChange = ((currentUsers - previousUsers) / previousUsers) * 100;
  const usersChangePercentage = usersChange;

  const currentSessions = overviewData?.data?.sessions ?? 0;
  const previousSessions = overviewDataPrevious?.data?.sessions ?? 0;
  const sessionsChange =
    ((currentSessions - previousSessions) / previousSessions) * 100;
  const sessionsChangePercentage = sessionsChange;

  const currentPageviews = overviewData?.data?.pageviews ?? 0;
  const previousPageviews = overviewDataPrevious?.data?.pageviews ?? 0;
  const pageviewsChange =
    ((currentPageviews - previousPageviews) / previousPageviews) * 100;
  const pageviewsChangePercentage = pageviewsChange;

  if (isLoading) {
    return <div className="h-[60px]"></div>;
  }

  return (
    <div className="flex gap-8 items-center">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-muted-foreground">
          Unique Users
        </div>
        <div className="text-3xl font-medium flex gap-2 items-center">
          <CountUp
            start={previousUsers}
            end={currentUsers}
            duration={0.5}
            separator=","
            formattingFn={formatter}
          />
          {!isLoading && (
            <Badge
              variant={usersChangePercentage > 0 ? "green" : "red"}
              className="text-xs"
            >
              {usersChangePercentage > 0 ? "+" : ""}
              {usersChangePercentage.toFixed(0)}%
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-muted-foreground">
          Sessions
        </div>
        <div className="text-3xl font-medium flex gap-2 items-center">
          <CountUp
            start={previousSessions}
            end={currentSessions}
            duration={0.5}
            separator=","
            formattingFn={formatter}
          />

          {!isLoading && (
            <Badge
              variant={sessionsChangePercentage > 0 ? "green" : "red"}
              className="text-xs"
            >
              {sessionsChangePercentage > 0 ? "+" : ""}
              {sessionsChangePercentage.toFixed(0)}%
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-muted-foreground">
          Pageviews
        </div>
        <div className="text-3xl font-medium flex gap-2 items-center">
          <CountUp
            start={previousPageviews}
            end={currentPageviews}
            duration={0.5}
            separator=","
            formattingFn={formatter}
          />
          {!isLoading && (
            <Badge
              variant={pageviewsChangePercentage > 0 ? "green" : "red"}
              className="text-xs"
            >
              {pageviewsChangePercentage > 0 ? "+" : ""}
              {pageviewsChangePercentage.toFixed(0)}%
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
