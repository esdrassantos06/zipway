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
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Top Links</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Most clicked links
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topLinksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tick={{ fontSize: 10 }} />
              <YAxis fontSize={12} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  fontSize: "12px",
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="clicks" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
