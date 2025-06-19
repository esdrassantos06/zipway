"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DeleteUserButton,
  PlaceholderButton,
} from "@/components/admin/DeleteUserButton";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import validator from "validator";
import {
  sanitizeAlias,
  validateAlias,
  isReservedAlias,
} from "@/utils/sanitize";

interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug?: string;
  clicks: number;
  status: "ACTIVE" | "PAUSED";
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface Session {
  user: {
    name: string;
    email: string;
    id: string;
  };
}

interface AdminDashboardClientProps {
  session: Session;
  links: Link[];
  users: User[];
}

interface TopLinkData {
  name: string;
  clicks: number;
}

export default function AdminDashboardClient({
  session,
  links: initialLinks,
  users,
}: AdminDashboardClientProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [newUrl, setNewUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [aliasWarning, setAliasWarning] = useState<string | null>(null);

  const [editUrl, setEditUrl] = useState<string>("");
  const [editSlug, setEditSlug] = useState<string>("");
  const [editAliasWarning, setEditAliasWarning] = useState<string | null>(null);

  const topLinksData: TopLinkData[] = links
    .slice()
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
    .map((link) => ({
      name: link.slug || link.shortUrl,
      clicks: link.clicks,
    }));

  const sortedUsers = users.sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return 0;
  });

  const handleCustomSlugChange = (newSlug: string) => {
    const sanitized = sanitizeAlias(newSlug);

    setCustomSlug(sanitized);

    if (newSlug && newSlug !== sanitized) {
      setAliasWarning(
        "Slug foi ajustado para conter apenas caracteres válidos",
      );
    } else if (sanitized && isReservedAlias(sanitized)) {
      setAliasWarning("Este slug é reservado pelo sistema");
    } else if (sanitized) {
      const validation = validateAlias(sanitized);
      if (!validation.valid) {
        setAliasWarning(validation.error || "Slug inválido");
      } else {
        setAliasWarning(null);
      }
    } else {
      setAliasWarning(null);
    }
  };

  const handleEditSlugChange = (newSlug: string) => {
    const sanitized = sanitizeAlias(newSlug);

    setEditSlug(sanitized);

    if (newSlug && newSlug !== sanitized) {
      setEditAliasWarning(
        "Slug foi ajustado para conter apenas caracteres válidos",
      );
    } else if (sanitized && isReservedAlias(sanitized)) {
      setEditAliasWarning("Este slug é reservado pelo sistema");
    } else if (sanitized) {
      const validation = validateAlias(sanitized);
      if (!validation.valid) {
        setEditAliasWarning(validation.error || "Slug inválido");
      } else {
        setEditAliasWarning(null);
      }
    } else {
      setEditAliasWarning(null);
    }
  };

  const handleCreateLink = async () => {
    if (!newUrl.trim()) {
      toast.error("Por favor, insira uma URL");
      return;
    }

    if (!validator.isURL(newUrl.trim(), { require_protocol: true })) {
      toast.error("Por favor, insira uma URL válida");
      return;
    }

    if (customSlug) {
      const sanitizedSlug = sanitizeAlias(customSlug);

      if (isReservedAlias(sanitizedSlug)) {
        toast.error("Este slug é reservado pelo sistema");
        return;
      }

      const validation = validateAlias(sanitizedSlug);
      if (!validation.valid) {
        toast.error(validation.error || "Slug inválido");
        return;
      }
    }

    setIsCreating(true);

    try {
      const payload: {
        targetUrl: string;
        custom_id?: string;
      } = { targetUrl: newUrl.trim() }; // Fixed: was using editUrl instead of newUrl

      if (customSlug.trim()) {
        payload.custom_id = sanitizeAlias(customSlug.trim());
      }

      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.short_url) {
        const newLink: Link = {
          id: data.id || Date.now().toString(),
          originalUrl: newUrl.trim(),
          shortUrl: data.short_url,
          slug: customSlug.trim() || data.short_url.split("/").pop() || "",
          clicks: 0,
          status: "ACTIVE",
          createdAt: new Date().toLocaleDateString("pt-BR"),
        };

        setLinks([newLink, ...links]);
        setNewUrl("");
        setCustomSlug("");
        setAliasWarning(null);
        setIsCreateDialogOpen(false);
        toast.success("Link criado com sucesso!");
      } else {
        throw new Error(data.error || "Erro ao criar link");
      }
    } catch (err) {
      console.error("Erro ao criar link:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Erro ao criar link");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditLink = async () => {
    if (!editUrl.trim()) {
      toast.error("Por favor, insira uma URL");
      return;
    }

    if (!validator.isURL(editUrl.trim(), { require_protocol: true })) {
      toast.error("Por favor, insira uma URL válida");
      return;
    }

    if (editSlug) {
      const sanitizedSlug = sanitizeAlias(editSlug);

      if (isReservedAlias(sanitizedSlug)) {
        toast.error("Este slug é reservado pelo sistema");
        return;
      }

      const validation = validateAlias(sanitizedSlug);
      if (!validation.valid) {
        toast.error(validation.error || "Slug inválido");
        return;
      }
    }

    setIsEditing(true);

    try {
      const payload: {
        targetUrl: string;
        shortId?: string;
      } = {
        targetUrl: editUrl.trim(),
      };

      if (editSlug.trim()) {
        payload.shortId = sanitizeAlias(editSlug.trim());
      }

      const res = await fetch(`/api/admin/edit-link/${editingLink?.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.link) {
        setLinks(
          links.map((link) =>
            link.id === editingLink?.id
              ? {
                  ...data.link,
                  status: data.link.status,
                  createdAt: new Date(data.link.createdAt).toLocaleDateString(
                    "en-US",
                  ),
                }
              : link,
          ),
        );

        setIsEditDialogOpen(false);
        setEditingLink(null);
        setEditUrl("");
        setEditSlug("");
        setEditAliasWarning(null);
        toast.success("Link atualizado com sucesso!");
      } else {
        throw new Error(data.error || "Erro ao atualizar link");
      }
    } catch (err) {
      console.error("Erro ao atualizar link:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Erro ao atualizar link");
      }
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/delete-link/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLinks(links.filter((link) => link.id !== id));
        toast.success("Link deletado com sucesso!");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Erro ao deletar link");
      }
    } catch (err) {
      console.error("Erro ao deletar link:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Erro ao deletar link");
      }
    }
  };

  const openEditDialog = (link: Link) => {
    // Fixed: Added type annotation
    setEditingLink(link);
    setEditUrl(link.originalUrl);
    setEditSlug(link.slug || "");
    setEditAliasWarning(null);
    setIsEditDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    if (!navigator.clipboard) {
      toast.error("API de clipboard não suportada no seu navegador");
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copiado para a área de transferência!");
      })
      .catch(() => {
        toast.error("Erro ao copiar para a área de transferência");
      });
  };

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getStatusDisplay = (status: string) => {
    return status.toLowerCase() === "active" || status === "ACTIVE"
      ? "active"
      : "paused";
  };

  const getStatusLabel = (status: string) => {
    return status.toLowerCase() === "active" || status === "ACTIVE"
      ? "Ativo"
      : "Inativo";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Painel Principal */}
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Olá, {session.user.name}! Gerencie todos os links encurtados
              </p>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Link</DialogTitle>
                  <DialogDescription>
                    Insira a URL que deseja encurtar
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">URL Original</Label>
                    <Input
                      id="url"
                      placeholder="https://exemplo.com/url-muito-longa"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug Personalizado (opcional)</Label>
                    <Input
                      id="slug"
                      placeholder="meu-link"
                      value={customSlug}
                      onChange={(e) => handleCustomSlugChange(e.target.value)}
                      disabled={isCreating}
                      className={aliasWarning ? "border-yellow-500" : ""}
                    />
                    {aliasWarning && (
                      <p className="mt-1 text-sm text-yellow-600">
                        {aliasWarning}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Apenas letras e números são permitidos. Caracteres
                      especiais serão removidos.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setNewUrl("");
                      setCustomSlug("");
                      setAliasWarning(null);
                    }}
                    disabled={isCreating}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateLink} disabled={isCreating}>
                    {isCreating ? "Criando..." : "Criar Link"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dialog de Edição */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Link</DialogTitle>
                <DialogDescription>
                  Modifique os dados do link encurtado
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-url">URL Original</Label>
                  <Input
                    id="edit-url"
                    placeholder="https://exemplo.com/url-muito-longa"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    disabled={isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-slug">Slug Personalizado</Label>
                  <Input
                    id="edit-slug"
                    placeholder="meu-link"
                    value={editSlug}
                    onChange={(e) => handleEditSlugChange(e.target.value)}
                    disabled={isEditing}
                    className={editAliasWarning ? "border-yellow-500" : ""}
                  />
                  {editAliasWarning && (
                    <p className="mt-1 text-sm text-yellow-600">
                      {editAliasWarning}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Apenas letras e números são permitidos. Caracteres especiais
                    serão removidos.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingLink(null);
                    setEditUrl("");
                    setEditSlug("");
                    setEditAliasWarning(null);
                  }}
                  disabled={isEditing}
                >
                  Cancelar
                </Button>
                <Button onClick={handleEditLink} disabled={isEditing}>
                  {isEditing ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Stats Cards */}
          <StatsCards links={links} />

          {/* Tabs */}
          <Tabs defaultValue="links" className="space-y-6">
            <TabsList>
              <TabsTrigger value="links">Gerenciar Links</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>

            <TabsContent value="links" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Links Encurtados</CardTitle>
                  <CardDescription>
                    Gerencie todos os links encurtados do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL Original</TableHead>
                        <TableHead>Link Encurtado</TableHead>
                        <TableHead>Cliques</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {links.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="py-8 text-center text-gray-500"
                          >
                            Nenhum link encontrado. Crie seu primeiro link!
                          </TableCell>
                        </TableRow>
                      ) : (
                        links.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell className="max-w-xs">
                              <div
                                className="truncate"
                                title={link.originalUrl}
                              >
                                {link.originalUrl.length > 35
                                  ? `${link.originalUrl.slice(0, 35)}...`
                                  : link.originalUrl}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-sm">
                                  {link.shortUrl}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(link.shortUrl)}
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
                            <TableCell>{link.createdAt}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => openLink(link.shortUrl)}
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visitar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openEditDialog(link)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteLink(link.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Deletar
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
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Links</CardTitle>
                  <CardDescription>Links mais clicados</CardDescription>
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
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                  <CardDescription>
                    Gerencie todos os usuários do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedUsers.map((user) => {
                        if (user.id === session.user.id) return null;

                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-mono text-sm">
                              {user.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === "ADMIN"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="text-right">
                              {user.role === "ADMIN" ||
                              user.id === session.user.id ? (
                                <PlaceholderButton />
                              ) : (
                                <DeleteUserButton userId={user.id} />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
