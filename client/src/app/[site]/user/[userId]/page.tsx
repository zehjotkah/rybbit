"use client";

import { useParams } from "next/navigation";
import SessionsList from "@/components/Sessions/SessionsList";

export default function UserPage() {
  const { userId } = useParams();

  return (
    <div className="mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">User Profile: {userId}</h1>
        <div className="text-sm text-gray-400 mb-6">User activity sessions</div>
      </div>

      <SessionsList userId={userId as string} />
    </div>
  );
}
