"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pause,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { LinkStatus } from "@/generated/prisma";
import { truncateUrl, copyToClipboard } from "@/utils/AppUtils";

type Link = {
  id: string;
  shortId: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  status: "ACTIVE" | "PAUSED";
  createdAt: string;
};

type LinksTableProps = {
  links: Link[];
  setLinks: Dispatch<SetStateAction<Link[]>>;
  isLoading?: boolean;
  limit?: number;
};

export function LinksTable({
  links,
  setLinks,
  isLoading = false,
  limit,
}: LinksTableProps) {
  const displayedLinks = limit ? links.slice(0, limit) : links;

  const deleteLink = async (link: Link) => {
    const confirmed = confirm("Are you sure you want to delete this link?");
    if (!confirmed) return;

    try {
      const identifier =
        link.shortId && link.shortId.trim() ? link.shortId : link.id;

      await axios.delete(`/api/user-links/${identifier}`);
      setLinks((prev) => prev.filter((l) => l.id !== link.id));
      toast.success("Link deleted successfully");
    } catch (error) {
      let message = "Error deleting link";
      console.error("Delete error:", error);

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }

      toast.error(message);
    }
  };

  const toggleLinkStatus = async (link: Link) => {
    const newStatus: Link["status"] =
      link.status === LinkStatus.ACTIVE ? LinkStatus.PAUSED : LinkStatus.ACTIVE;

    try {
      const identifier =
        link.shortId && link.shortId.trim() ? link.shortId : link.id;

      await axios.patch(`/api/user-links/${identifier}/status`, {
        status: newStatus,
      });

      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, status: newStatus } : l)),
      );

      toast.success(
        `Link ${newStatus === "ACTIVE" ? "activated" : "paused"} successfully`,
      );
    } catch (error) {
      let message = "Error updating status";
      console.error("Toggle status error:", error);

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }

      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Links</CardTitle>
          <CardDescription>Manage all your shortened links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Links</CardTitle>
        <CardDescription>Manage all your shortened links</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Original URL</TableHead>
              <TableHead>Short Link</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedLinks.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="max-w-[300px]">
                  <div
                    className="truncate"
                    title={link.originalUrl}
                    aria-label={link.originalUrl}
                  >
                    {truncateUrl(link.originalUrl, 40)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{link.shortUrl}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-6"
                      onClick={() => copyToClipboard(link.shortUrl)}
                    >
                      <Copy className="size-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {link.clicks.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={link.status === "ACTIVE" ? "default" : "secondary"}
                  >
                    {link.status === "ACTIVE" ? "Active" : "Paused"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(link.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => window.open(link.originalUrl, "_blank")}
                      >
                        <ExternalLink className="mr-2 size-4" />
                        Abrir Original
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(link.shortUrl)}
                      >
                        <Copy className="mr-2 size-4" />
                        Copiar Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleLinkStatus(link)}>
                        <Pause className="mr-2 size-4" />
                        {link.status === "ACTIVE" ? "Pause" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteLink(link)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
