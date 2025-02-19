import { authClient } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { ChangePassword } from "./ChangePassword";
import { DeleteAccount } from "./DeleteAccount";

export function Account({
  session,
}: {
  session: ReturnType<typeof authClient.useSession>;
}) {
  const [username, setUsername] = useState(session.data?.user.username ?? "");
  const [email, setEmail] = useState(session.data?.user.email ?? "");

  const hasChanges =
    username !== session.data?.user.username ||
    email !== session.data?.user.email;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-xl">Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              className="w-60"
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              className="w-60"
              id="email"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant={"accent"} disabled={!hasChanges}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
      <Card className="p-2 pt-6">
        <CardContent className="flex flex-col gap-4">
          <ChangePassword />
          <DeleteAccount />
        </CardContent>
      </Card>
    </div>
  );
}
