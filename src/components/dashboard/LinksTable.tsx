"use client";

import { useState } from "react";
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
import { Link, LinkStatus } from "@/generated/prisma";
import {
  truncateUrl,
  copyToClipboard,
  openLink,
  getShortUrl,
} from "@/utils/AppUtils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import SearchBar from "./SearchBar";

type LinksTableProps = {
  links: Link[];
  isLoading?: boolean;
  limit?: number;
  userId: string;
};

export function LinksTable({
  links,
  isLoading = false,
  limit,
  userId,
}: LinksTableProps) {
  const [confirmLink, setConfirmLink] = useState<Link | null>(null);
  const [filteredLinks, setFilteredLinks] = useState<Link[] | null>(null);

  const handleSearchResults = (results: Link[] | null) => {
    if (results === null) {
      setFilteredLinks(null);
    } else {
      setFilteredLinks(results);
    }
  };

  const displayedLinks = filteredLinks
    ? limit
      ? filteredLinks.slice(0, limit)
      : filteredLinks
    : limit
      ? links.slice(0, limit)
      : links;

  const deleteLink = async (link: Link) => {
    try {
      const identifier =
        link.shortId && link.shortId.trim() ? link.shortId : link.id;

      await axios.delete(`/api/user-links/${identifier}`);
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Links</CardTitle>
          <CardDescription>Manage all your shortened links</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchBar userId={userId} onSearchResults={handleSearchResults} />
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
              {displayedLinks.map((link) => {
                return (
                  <TableRow key={link.id}>
                    <TableCell className="max-w-[300px]">
                      <div
                        className="truncate"
                        title={link.targetUrl}
                        aria-label={link.targetUrl}
                      >
                        {truncateUrl(link.targetUrl, 40)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {getShortUrl(link.shortId)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-6"
                          onClick={() =>
                            copyToClipboard(getShortUrl(link.shortId))
                          }
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
                        variant={
                          link.status === "ACTIVE" ? "default" : "secondary"
                        }
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openLink(link.targetUrl)}
                          >
                            <ExternalLink className="mr-2 size-4" />
                            Open Original
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              copyToClipboard(
                                `${process.env.NEXT_PUBLIC_URL}/${link.shortId}`,
                              )
                            }
                          >
                            <Copy className="mr-2 size-4" />
                            Copiar Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleLinkStatus(link)}
                          >
                            <Pause className="mr-2 size-4" />
                            {link.status === "ACTIVE" ? "Pause" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setConfirmLink(link)}
                          >
                            <Trash2 className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!confirmLink}
        onOpenChange={(open) => !open && setConfirmLink(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this link? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (confirmLink) {
                  deleteLink(confirmLink);
                  setConfirmLink(null);
                }
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
