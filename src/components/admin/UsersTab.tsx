import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DeleteUserButton,
  PlaceholderButton,
} from "@/components/admin/DeleteUserButton";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface Session {
  user: {
    name: string;
    email: string;
    id: string;
  };
}

interface UsersTabProps {
  users: User[];
  session: Session;
}

export function UsersTab({ users, session }: UsersTabProps) {
  const sortedUsers = users.sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage all users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => {
              if (user.id === session.user.id) return null;

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm">
                    {user.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right">
                    {user.role === "ADMIN" || user.id === session.user.id ? (
                      <PlaceholderButton />
                    ) : (
                      <DeleteUserButton userId={user.id} />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
