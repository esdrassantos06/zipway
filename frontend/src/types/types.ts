// ADMIN DASHBOARD

export interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug?: string;
  clicks: number;
  status: "ACTIVE" | "PAUSED";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface Session {
  user: {
    name: string;
    email: string;
    id: string;
  };
}

export interface TopLinkData {
  name: string;
  clicks: number;
}

export interface AdminDashboardClientProps {
  session: Session;
  links: Link[];
  users: User[];
}
