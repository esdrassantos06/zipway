"use client";

import { useEffect, useState } from "react";
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
import { Copy, ExternalLink, MoreHorizontal, Pause, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

type Link = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  status: "active" | "paused";
  createdAt: string;
};

export function LinksTable() {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const res = await fetch("/api/user-links");
      const data = await res.json();
      if (res.ok) {
        setLinks(data.links);
      }
    };

    fetchLinks();
  }, []);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  };

  const deleteLink = async (id: string) => {
    const confirmed = confirm("Tem certeza que deseja excluir este link?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/user-links/${id}`);
      setLinks((prev) => prev.filter((link) => link.id !== id));
      toast.success("Link excluído com sucesso");
    } catch (error) {
      let message = "Erro ao excluir link";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }

      toast.error(message);
    }
  };

  const toggleLinkStatus = async (
    id: string,
    currentStatus: "active" | "paused",
  ) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";

    try {
      await axios.patch(`/api/user-links/${id}/status`, { status: newStatus });

      setLinks((prev) =>
        prev.map((link) =>
          link.id === id ? { ...link, status: newStatus } : link,
        ),
      );

      toast.success(
        `Link ${newStatus === "active" ? "ativado" : "pausado"} com sucesso`,
      );
    } catch (error) {
      let message = "Erro ao atualizar status";

      if (axios.isAxiosError(error)) {
        // AxiosError tem a propriedade response, que pode conter o erro do backend
        message = error.response?.data?.error || message;
      }

      toast.error(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links Recentes</CardTitle>
        <CardDescription>
          Gerencie todos os seus links encurtados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL Original</TableHead>
              <TableHead>Link Curto</TableHead>
              <TableHead>Cliques</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="max-w-[300px]">
                  <div className="truncate" title={link.originalUrl}>
                    {link.originalUrl}
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
                    variant={link.status === "active" ? "default" : "secondary"}
                  >
                    {link.status === "active" ? "Ativo" : "Pausado"}
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
                      <DropdownMenuItem
                        onClick={() => toggleLinkStatus(link.id, link.status)}
                      >
                        <Pause className="mr-2 size-4" />
                        {link.status === "active" ? "Pausar" : "Ativar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteLink(link.id)}
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
