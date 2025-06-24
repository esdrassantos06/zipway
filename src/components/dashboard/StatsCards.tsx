import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/generated/prisma";
import { Stats } from "@/types/types";
import { Link2Icon, MousePointer } from "lucide-react";

type StatsCardsProps = {
  links: Link[];
};

export function StatsCards({ links }: StatsCardsProps) {
  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, link) => acc + link.clicks, 0);

  const stats: Stats[] = [
    {
      title: "Total Links",
      value: totalLinks.toLocaleString(),
      icon: Link2Icon,
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
