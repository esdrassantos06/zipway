import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import axios from "axios";
import { getSessionFromHeaders } from "@/utils/getSession";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role?: string | "USER" | "ADMIN";
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

const AdminDashboard = async () => {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const { users: rawUsers } = await auth.api.listUsers({
    headers: headersList,
    query: {
      sortBy: "name",
    },
  });

  const users: User[] = (rawUsers as UserWithRole[]).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: (user.role || "USER") as "USER" | "ADMIN",
  }));

  const sortedUsers = users.sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return 0;
  });

  let links = [];

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/all-links`,
      {
        headers: {
          Cookie: headersList.get("cookie") || "",
        },
        withCredentials: true,
      },
    );

    links = res.data.links;
  } catch (error) {
    console.error("Error fetching links:", error);
    throw new Error("Erro fetching links");
  }

  return (
    <AdminDashboardClient session={session} users={sortedUsers} links={links} />
  );
};

export default AdminDashboard;
