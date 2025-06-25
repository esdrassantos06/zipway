"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "@/generated/prisma";

interface TopLinkData {
  name: string;
  clicks: number;
}

interface AnalyticsTabProps {
  links: Link[];
}

export function AnalyticsTab({ links }: AnalyticsTabProps) {
  const topLinksData: TopLinkData[] = links
    .slice()
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
    .map((link) => ({
      name: link.shortId,
      clicks: link.clicks,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Links</CardTitle>
        <CardDescription>Most clicked links</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topLinksData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="clicks" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
