import DashboardClient from "./DashboardClient";

interface Session {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

interface DashboardProps {
  session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
  return (
    <div className="bg-background flex h-screen">
      <DashboardClient session={session} />
    </div>
  );
}
