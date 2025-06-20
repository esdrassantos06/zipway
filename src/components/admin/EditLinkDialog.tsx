import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

interface EditLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingLink: Link | null;
  onSubmit: (url: string, slug: string) => Promise<boolean>;
}

export function EditLinkDialog({
  isOpen,
  onClose,
  editingLink,
  onSubmit,
}: EditLinkDialogProps) {
  const [editUrl, setEditUrl] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editAliasWarning, setEditAliasWarning] = useState<string | null>(null);

  useEffect(() => {
    if (editingLink) {
      setEditUrl(editingLink.originalUrl);
      setEditSlug(editingLink.slug || "");
      setEditAliasWarning(null);
    }
  }, [editingLink]);

  const handleEditSlugChange = (newSlug: string) => {
    const sanitized = sanitizeAlias(newSlug);

    setEditSlug(sanitized);

    if (newSlug && newSlug !== sanitized) {
      setEditAliasWarning("Slug was adjusted to contain only valid characters");
    } else if (sanitized && isReservedAlias(sanitized)) {
      setEditAliasWarning("This slug is reserved by the system");
    } else if (sanitized) {
      const validation = validateAlias(sanitized);
      if (!validation.valid) {
        setEditAliasWarning(validation.error || "Invalid slug");
      } else {
        setEditAliasWarning(null);
      }
    } else {
      setEditAliasWarning(null);
    }
  };

  const handleSubmit = async () => {
    setIsEditing(true);
    const success = await onSubmit(editUrl, editSlug);

    if (success) {
      resetForm();
    }

    setIsEditing(false);
  };

  const resetForm = () => {
    setEditUrl("");
    setEditSlug("");
    setEditAliasWarning(null);
  };

  const handleClose = () => {
    if (!isEditing) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Modify the shortened link information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-url">Original URL</Label>
            <Input
              id="edit-url"
              placeholder="https://example.com/very-long-url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              disabled={isEditing}
            />
          </div>
          <div>
            <Label htmlFor="edit-slug">Custom Slug</Label>
            <Input
              id="edit-slug"
              placeholder="my-link"
              value={editSlug}
              onChange={(e) => handleEditSlugChange(e.target.value)}
              disabled={isEditing}
              className={editAliasWarning ? "border-yellow-500" : ""}
            />
            {editAliasWarning && (
              <p className="mt-1 text-sm text-yellow-600">{editAliasWarning}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Only letters and numbers are allowed. Special characters will be
              removed.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isEditing}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isEditing}>
            {isEditing ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
