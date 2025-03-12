"use client";

import { authClient } from "@/lib/auth";
import { AccountInner } from "./components/AccountInner";

export default function AccountPage() {
  const session = authClient.useSession();

  if (!session.data) {
    return null;
  }

  return <AccountInner session={session} />;
}
