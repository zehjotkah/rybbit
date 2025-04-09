"use client";

import { SESSION_PAGE_FILTERS } from "../../../lib/store";
import { SubHeader } from "../components/SubHeader/SubHeader";
import SessionsList from "@/components/Sessions/SessionsList";

export default function SessionsPage() {
  return (
    <div>
      <SubHeader availableFilters={SESSION_PAGE_FILTERS} />
      <SessionsList />
    </div>
  );
}
