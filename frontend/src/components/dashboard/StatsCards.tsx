"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, MousePointer } from "lucide-react";

type Stats = {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

type Link = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  status: "active" | "paused";
  createdAt: string;
};

export function StatsCards() {
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user-links");
        const data = await res.json();

        if (res.ok) {
          const links = data.links;
          setTotalLinks(links.length);
          const clicksSum = links.reduce(
            (acc: number, link: Link) => acc + link.clicks,
            0,
          );
          setTotalClicks(clicksSum);
        }
      } catch (error) {
        console.error("Erro ao buscar stats:", error);
      }
    };

    fetchStats();
  }, []);

  const stats: Stats[] = [
    {
      title: "Total Links",
      value: totalLinks.toLocaleString(),
      icon: Link,
      color: "text-blue-600",
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString(),
      icon: MousePointer,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`size-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
