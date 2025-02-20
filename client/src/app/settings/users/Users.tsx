"use client";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { authClient } from "../../../lib/auth";
import { AddUser } from "./AddUser";
import { DeleteUser } from "./DeleteUser";

export function Users() {
  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await authClient.admin.listUsers({ query: { limit: 100 } });
      return users;
    },
  });

  if (users?.error) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-2">
        <CardHeader>
          <CardTitle className="text-xl flex justify-between items-center">
            Users
            <AddUser refetch={refetch} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.data?.users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role || "admin"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {DateTime.fromJSDate(user.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {user.name !== "admin" && (
                      <DeleteUser user={user} refetch={refetch} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
