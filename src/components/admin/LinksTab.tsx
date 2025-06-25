import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, Trash2, MoreHorizontal, ExternalLink } from "lucide-react";
import {
  copyToClipboard,
  openLink,
  getStatusDisplay,
  getStatusLabel,
  truncateUrl,
  getShortUrl,
} from "@/utils/AppUtils";
import { Link } from "@/generated/prisma";

interface LinksTabProps {
  links: Link[];
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}

export function LinksTab({ links, onEdit, onDelete }: LinksTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shortened Links</CardTitle>
        <CardDescription>
          Manage all shortened links in the system
        </CardDescription>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-gray-500"
                >
                  No links found. Create your first link!
                </TableCell>
              </TableRow>
            ) : (
              links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={link.targetUrl}>
                      {truncateUrl(link.targetUrl, 35)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">
                        {getShortUrl(link.shortId)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(getShortUrl(link.shortId))
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {link.clicks.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getStatusDisplay(link.status) === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {getStatusLabel(link.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(link.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openLink(getShortUrl(link.shortId))}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(link)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onDelete(link.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
