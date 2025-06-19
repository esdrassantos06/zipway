"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import validator from "validator";
import {
  sanitizeAlias,
  validateAlias,
  isReservedAlias,
} from "@/utils/sanitize";

import { StatsCards } from "@/components/dashboard/StatsCards";
import { CreateLinkDialog } from "./CreateLinkDialog";
import { EditLinkDialog } from "./EditLinkDialog";
import { LinksTab } from "./LinksTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { UsersTab } from "./UsersTab";
import Header from "../Header";

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

export default function AdminDashboardClient({
  session,
  links: initialLinks,
  users,
}: AdminDashboardClientProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const handleCreateLink = async (url: string, customSlug: string) => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return false;
    }

    if (!validator.isURL(url.trim(), { require_protocol: true })) {
      toast.error("Please enter a valid URL");
      return false;
    }

    if (customSlug) {
      const sanitizedSlug = sanitizeAlias(customSlug);

      if (isReservedAlias(sanitizedSlug)) {
        toast.error("This slug is reserved by the system");
        return false;
      }

      const validation = validateAlias(sanitizedSlug);
      if (!validation.valid) {
        toast.error(validation.error || "Invalid slug");
        return false;
      }
    }

    try {
      const payload: {
        targetUrl: string;
        custom_id?: string;
      } = { targetUrl: url.trim() };

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
          originalUrl: url.trim(),
          shortUrl: data.short_url,
          slug: customSlug.trim() || data.short_url.split("/").pop() || "",
          clicks: 0,
          status: "ACTIVE",
          createdAt: new Date().toLocaleDateString("en-US"),
        };

        setLinks([newLink, ...links]);
        setIsCreateDialogOpen(false);
        toast.success("Link created successfully!");
        return true;
      } else {
        throw new Error(data.error || "Error creating link");
      }
    } catch (err) {
      console.error("Error creating link:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error creating link");
      }
      return false;
    }
  };

  const handleEditLink = async (url: string, slug: string) => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return false;
    }

    if (!validator.isURL(url.trim(), { require_protocol: true })) {
      toast.error("Please enter a valid URL");
      return false;
    }

    if (slug) {
      const sanitizedSlug = sanitizeAlias(slug);

      if (isReservedAlias(sanitizedSlug)) {
        toast.error("This slug is reserved by the system");
        return false;
      }

      const validation = validateAlias(sanitizedSlug);
      if (!validation.valid) {
        toast.error(validation.error || "Invalid slug");
        return false;
      }
    }

    try {
      const payload: {
        targetUrl: string;
        shortId?: string;
      } = {
        targetUrl: url.trim(),
      };

      if (slug.trim()) {
        payload.shortId = sanitizeAlias(slug.trim());
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
        toast.success("Link updated successfully!");
        return true;
      } else {
        throw new Error(data.error || "Error updating link");
      }
    } catch (err) {
      console.error("Error updating link:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error updating link");
      }
      return false;
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/delete-link/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLinks(links.filter((link) => link.id !== id));
        toast.success("Link deleted successfully!");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Error deleting link");
      }
    } catch (err) {
      console.error("Error deleting link:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error deleting link");
      }
    }
  };

  const openEditDialog = (link: Link) => {
    setEditingLink(link);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Hello, {session.user.name}! Manage all shortened links
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Link
            </Button>
          </div>

          {/* Dialogs */}
          <CreateLinkDialog
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            onSubmit={handleCreateLink}
          />

          <EditLinkDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingLink(null);
            }}
            editingLink={editingLink}
            onSubmit={handleEditLink}
          />

          {/* Stats Cards */}
          <StatsCards links={links} />

          {/* Tabs */}
          <Tabs defaultValue="links" className="space-y-6">
            <TabsList>
              <TabsTrigger value="links">Manage Links</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="links" className="space-y-6">
              <LinksTab
                links={links}
                onEdit={openEditDialog}
                onDelete={handleDeleteLink}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsTab links={links} />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UsersTab users={users} session={session} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
