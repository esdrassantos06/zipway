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
  Calendar,
  MousePointer,
  Link as LinkIcon,
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
  const [filteredLinks, setFilteredLinks] = useState<Link[] | null>(null);
  const [confirmLink, setConfirmLink] = useState<Link | null>(null);

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
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Recent Links</CardTitle>
          <CardDescription>Manage all your shortened links</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
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
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Recent Links</CardTitle>
          <CardDescription>Manage all your shortened links</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <SearchBar userId={userId} onSearchResults={handleSearchResults} />

          {/* Mobile & Tablet Card View */}
          <div className="space-y-3 lg:hidden">
            {displayedLinks.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <LinkIcon className="text-muted-foreground/50 mx-auto mb-4 size-12" />
                <p className="mb-2 text-lg font-medium">No links found</p>
                <p className="text-sm">
                  Create your first shortened link to get started!
                </p>
              </div>
            ) : (
              displayedLinks.map((link) => (
                <Card
                  key={link.id}
                  className="border shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header with Status */}
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <LinkIcon className="size-4 text-blue-600" />
                            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                              Shortened Link
                            </p>
                          </div>
                          <p
                            className="text-foreground truncate text-sm font-medium"
                            title={link.targetUrl}
                          >
                            {truncateUrl(link.targetUrl, 60)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            link.status === "ACTIVE" ? "default" : "secondary"
                          }
                          className="ml-2 flex-shrink-0 text-xs"
                        >
                          {link.status === "ACTIVE" ? "Active" : "Paused"}
                        </Badge>
                      </div>

                      {/* Short Link */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-muted-foreground mb-2 text-xs">
                          Short URL
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="bg-background flex-1 truncate rounded border px-2 py-1 font-mono text-sm">
                            {getShortUrl(link.shortId)}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 flex-shrink-0"
                            onClick={() =>
                              copyToClipboard(getShortUrl(link.shortId))
                            }
                          >
                            <Copy className="size-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                            <MousePointer className="size-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">
                              Clicks
                            </p>
                            <p className="text-sm font-semibold">
                              {link.clicks.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                            <Calendar className="size-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">
                              Created
                            </p>
                            <p className="text-sm font-semibold">
                              {new Date(link.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between border-t pt-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openLink(link.targetUrl)}
                            className="h-8 px-3 text-xs"
                          >
                            <ExternalLink className="mr-1 size-3" />
                            Open
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLinkStatus(link)}
                            className="h-8 px-3 text-xs"
                          >
                            <Pause className="mr-1 size-3" />
                            {link.status === "ACTIVE" ? "Pause" : "Activate"}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmLink(link)}
                          className="h-8 px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="mr-1 size-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="-mx-4 overflow-x-auto sm:-mx-6">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[250px] xl:min-w-[350px]">
                        Original URL
                      </TableHead>
                      <TableHead className="min-w-[180px]">
                        Short Link
                      </TableHead>
                      <TableHead className="min-w-[100px]">Clicks</TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Date</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedLinks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <LinkIcon className="text-muted-foreground/50 size-12" />
                            <div>
                              <p className="mb-1 text-lg font-medium">
                                No links found
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Create your first shortened link to get started!
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedLinks.map((link) => (
                        <TableRow key={link.id} className="hover:bg-muted/50">
                          <TableCell className="max-w-[250px] xl:max-w-[350px]">
                            <div
                              className="truncate"
                              title={link.targetUrl}
                              aria-label={link.targetUrl}
                            >
                              {truncateUrl(link.targetUrl, 50)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="bg-muted rounded px-2 py-1 font-mono text-sm">
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
                            <span className="text-sm font-medium">
                              {link.clicks.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                link.status === "ACTIVE"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {link.status === "ACTIVE" ? "Active" : "Paused"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {new Date(link.createdAt).toLocaleDateString()}
                            </span>
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
                              <DropdownMenuContent align="end" className="w-56">
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
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toggleLinkStatus(link)}
                                >
                                  <Pause className="mr-2 size-4" />
                                  {link.status === "ACTIVE"
                                    ? "Pause"
                                    : "Activate"}
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!confirmLink}
        onOpenChange={(open) => !open && setConfirmLink(null)}
      >
        <AlertDialogContent className="w-[90vw] max-w-md sm:max-w-lg">
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
