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
import { User as UserIcon, Shield, Mail, Hash } from "lucide-react";

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

  const filteredUsers = sortedUsers.filter(
    (user) => user.id !== session.user.id,
  );

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Manage all users in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {/* Mobile & Tablet Card View */}
        <div className="space-y-3 lg:hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <UserIcon className="text-muted-foreground/50 mx-auto mb-4 size-12" />
              <p className="mb-2 text-lg font-medium">No users found</p>
              <p className="text-sm">No other users in the system.</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="border shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Header with Role */}
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <UserIcon className="size-4 text-blue-600" />
                          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            User Account
                          </p>
                        </div>
                        <p
                          className="text-foreground truncate text-sm font-medium"
                          title={user.name}
                        >
                          {user.name}
                        </p>
                      </div>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                        className="ml-2 flex-shrink-0 text-xs"
                      >
                        {user.role}
                      </Badge>
                    </div>

                    {/* User Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                          <Mail className="size-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-muted-foreground text-xs">Email</p>
                          <p
                            className="truncate text-sm font-medium"
                            title={user.email}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                          <Hash className="size-4 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-muted-foreground text-xs">
                            User ID
                          </p>
                          <p className="text-muted-foreground font-mono text-sm">
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end border-t pt-3">
                      {user.role === "ADMIN" ? (
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <Shield className="size-3" />
                          <span>Admin users cannot be deleted</span>
                        </div>
                      ) : (
                        <DeleteUserButton userId={user.id} />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="-mx-4 overflow-x-auto sm:-mx-6">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">ID</TableHead>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[120px]">Role</TableHead>
                    <TableHead className="min-w-[250px]">Email</TableHead>
                    <TableHead className="w-[80px] text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <UserIcon className="text-muted-foreground/50 size-12" />
                          <div>
                            <p className="mb-1 text-lg font-medium">
                              No users found
                            </p>
                            <p className="text-muted-foreground text-sm">
                              No other users in the system.
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          {user.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">
                          <span className="text-sm">{user.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "ADMIN" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className="block max-w-[200px] truncate text-sm"
                            title={user.email}
                          >
                            {user.email}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {user.role === "ADMIN" ? (
                            <PlaceholderButton />
                          ) : (
                            <DeleteUserButton userId={user.id} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
