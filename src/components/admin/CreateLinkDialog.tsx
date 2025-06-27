import { useState } from "react";
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

interface CreateLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, customSlug: string) => Promise<boolean>;
}

export function CreateLinkDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateLinkDialogProps) {
  const [newUrl, setNewUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [aliasWarning, setAliasWarning] = useState<string | null>(null);

  const handleCustomSlugChange = (newSlug: string) => {
    const sanitized = sanitizeAlias(newSlug);

    setCustomSlug(sanitized);

    if (newSlug && newSlug !== sanitized) {
      setAliasWarning("Slug was adjusted to contain only valid characters");
    } else if (sanitized && isReservedAlias(sanitized)) {
      setAliasWarning("This slug is reserved by the system");
    } else if (sanitized) {
      const validation = validateAlias(sanitized);
      if (!validation.valid) {
        setAliasWarning(validation.error || "Invalid slug");
      } else {
        setAliasWarning(null);
      }
    } else {
      setAliasWarning(null);
    }
  };

  const handleSubmit = async () => {
    setIsCreating(true);
    const success = await onSubmit(newUrl, customSlug);

    if (success) {
      resetForm();
    }

    setIsCreating(false);
  };

  const resetForm = () => {
    setNewUrl("");
    setCustomSlug("");
    setAliasWarning(null);
  };

  const handleClose = () => {
    if (!isCreating) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Link</DialogTitle>
          <DialogDescription>
            Enter the URL you want to shorten
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">Original URL</Label>
            <Input
              id="url"
              placeholder="https://example.com/very-long-url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              disabled={isCreating}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Custom Slug (optional)</Label>
            <Input
              id="slug"
              placeholder="mylink"
              value={customSlug}
              onChange={(e) => handleCustomSlugChange(e.target.value)}
              disabled={isCreating}
              className={aliasWarning ? "border-yellow-500" : ""}
            />
            {aliasWarning && (
              <p className="mt-1 text-sm text-yellow-600">{aliasWarning}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Only letters and numbers are allowed. Special characters will be
              removed.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
