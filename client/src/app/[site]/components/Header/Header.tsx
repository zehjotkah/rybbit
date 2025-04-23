"use client";

import { userStore } from "../../../../lib/userStore";
import { UsageBanners } from "./UsageBanners";

export function Header() {
  const { user } = userStore();

  return (
    <div className="flex flex-col">
      {user && (
        <div className="m-4 mb-0">
          <UsageBanners />
        </div>
      )}
    </div>
  );
}
