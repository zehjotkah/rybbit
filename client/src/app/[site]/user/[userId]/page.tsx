"use client";

import SessionsList from "@/components/Sessions/SessionsList";
import Avatar from "boring-avatars";
import { DateTime } from "luxon";
import { useParams } from "next/navigation";
import { useUserInfo } from "../../../../api/analytics/userInfo";
import { formatDuration } from "../../../../lib/utils";

export default function UserPage() {
  const { userId } = useParams();
  const { site } = useParams();

  const { data } = useUserInfo(Number(site), userId as string);

  return (
    <div className="mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Avatar
            size={48}
            name={userId as string}
            variant="marble"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />{" "}
          {userId?.slice(0, 10)}
        </h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-neutral-850 p-3 rounded-lg flex flex-col gap-1 border border-neutral-750">
              <div className="text-xs text-neutral-400">
                Avg. Session Duration
              </div>
              <div className="font-semibold">
                {data?.duration ? formatDuration(data.duration) : "N/A"}
              </div>
            </div>
            <div className="bg-neutral-850 p-3 rounded-lg flex flex-col gap-1 border border-neutral-750">
              <div className="text-xs text-neutral-400">First Seen</div>
              <div className="font-semibold">
                {DateTime.fromSQL(data?.first_seen ?? "").toLocaleString(
                  DateTime.DATETIME_SHORT
                )}
              </div>
            </div>
            <div className="bg-neutral-850 p-3 rounded-lg flex flex-col gap-1 border border-neutral-750">
              <div className="text-xs text-neutral-400">Last Seen</div>
              <div className="font-semibold">
                {DateTime.fromSQL(data?.last_seen ?? "").toLocaleString(
                  DateTime.DATETIME_SHORT
                )}
              </div>
            </div>
            <div className="bg-neutral-850 p-3 rounded-lg flex flex-col gap-1 border border-neutral-750">
              <div className="text-xs text-neutral-400">Pageviews</div>
              <div className="font-semibold">{data?.pageviews}</div>
            </div>
            <div className="bg-neutral-850 p-3 rounded-lg flex flex-col gap-1 border border-neutral-750">
              <div className="text-xs text-neutral-400">Events</div>
              <div className="font-semibold">{data?.events}</div>
            </div>
            <div className="bg-neutral-850 p-3 rounded-lg flex flex-col gap-1 border border-neutral-750">
              <div className="text-xs text-neutral-400">Sessions</div>
              <div className="font-semibold">{data?.sessions}</div>
            </div>
          </div>
        </div>
      </div>

      <SessionsList userId={userId as string} />
    </div>
  );
}
