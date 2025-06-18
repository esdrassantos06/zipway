import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  DeleteUserButton,
  PlaceholderButton,
} from "@/components/admin/DeleteUserButton";

const AdminDashboard = async () => {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) redirect("/auth/login");

  if (session.user.role !== "ADMIN") redirect("/");

  const { users } = await auth.api.listUsers({
    headers: headersList,
    query: {
      sortBy: "name",
    },
  });

  const sortedUsers = users.sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return 0;
  });

  return (
    <div>
      <h1>Admin Dashboard</h1>
      Olá! {session.user.name}
      <h3 className="mt-4">Aqui tem todos os usuários:</h3>
      <table className="mt-4 w-full max-w-4xl table-auto border-collapse border border-gray-400">
        <thead className="bg-slate-200">
          <tr>
            <th className="border border-gray-400 px-4 py-2">ID</th>
            <th className="border border-gray-400 px-4 py-2">Nome</th>
            <th className="border border-gray-400 px-4 py-2">Função</th>
            <th className="border border-gray-400 px-4 py-2">Email</th>
            <th className="border border-gray-400 px-4 py-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, i) => {
            if (user.id === session.user.id) return null;

            return (
              <tr key={i} className="bg-slate-100">
                <td className="border border-gray-400 px-4 py-2">
                  {user.id.slice(0, 8)}...
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {user.name}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {user.role}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  {user.role === "ADMIN" || user.id === session.user.id ? (
                    <PlaceholderButton />
                  ) : (
                    <DeleteUserButton userId={user.id} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
