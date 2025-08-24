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
import {
  Copy,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  MousePointer,
  Link as LinkIcon,
} from "lucide-react";
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
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Shortened Links</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Manage all shortened links in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {/* Mobile & Tablet Card View */}
        <div className="space-y-3 lg:hidden">
          {links.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <LinkIcon className="text-muted-foreground/50 mx-auto mb-4 size-12" />
              <p className="mb-2 text-lg font-medium">No links found</p>
              <p className="text-sm">
                No shortened links have been created yet.
              </p>
            </div>
          ) : (
            links.map((link) => (
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
                            System Link
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
                          getStatusDisplay(link.status) === "active"
                            ? "default"
                            : "secondary"
                        }
                        className="ml-2 flex-shrink-0 text-xs"
                      >
                        {getStatusLabel(link.status)}
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
                          onClick={() => openLink(getShortUrl(link.shortId))}
                          className="h-8 px-3 text-xs"
                        >
                          <ExternalLink className="mr-1 size-3" />
                          Visit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(link)}
                          className="h-8 px-3 text-xs"
                        >
                          <Edit className="mr-1 size-3" />
                          Edit
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(link.id)}
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
                    <TableHead className="min-w-[180px]">Short Link</TableHead>
                    <TableHead className="min-w-[100px]">Clicks</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Date</TableHead>
                    <TableHead className="w-[60px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <LinkIcon className="text-muted-foreground/50 size-12" />
                          <div>
                            <p className="mb-1 text-lg font-medium">
                              No links found
                            </p>
                            <p className="text-muted-foreground text-sm">
                              No shortened links have been created yet.
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    links.map((link) => (
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
                            className="text-xs"
                          >
                            {getStatusLabel(link.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
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
                                onClick={() =>
                                  openLink(getShortUrl(link.shortId))
                                }
                              >
                                <ExternalLink className="mr-2 size-4" />
                                Visit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onEdit(link)}>
                                <Edit className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => onDelete(link.id)}
                              >
                                <Trash2 className="mr-2 size-4" />
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
