"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Link, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import validator from "validator";
import { shortenUrl } from "@/utils/axios";
import {
  sanitizeAlias,
  validateAlias,
  isReservedAlias,
} from "@/utils/sanitize";
import { copyToClipboard } from "@/utils/AppUtils";

let globalUrl = "";
let globalShortenedUrl: string | null = null;
let globalCustomAlias = "";

interface LinkType {
  id: string;
  shortId: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  status: "ACTIVE" | "PAUSED";
  createdAt: string;
}

interface LinkFormProps {
  onLinkCreated?: (link: LinkType) => void;
}

export function LinkForm({ onLinkCreated }: LinkFormProps) {
  const [url, setUrl] = useState(globalUrl);
  const [customAlias, setCustomAlias] = useState(globalCustomAlias);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(
    globalShortenedUrl,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aliasWarning, setAliasWarning] = useState<string | null>(null);

  const updateUrl = (newUrl: string) => {
    setUrl(newUrl);
    setShortenedUrl(null);
    globalUrl = newUrl;
    globalShortenedUrl = null;
  };

  const updateCustomAlias = (newAlias: string) => {
    const sanitized = sanitizeAlias(newAlias);

    setCustomAlias(sanitized);
    globalCustomAlias = sanitized;

    if (newAlias && newAlias !== sanitized) {
      setAliasWarning(
        "Alias ​​has been adjusted to contain only valid characters",
      );
    } else if (sanitized && isReservedAlias(sanitized)) {
      setAliasWarning("This alias is reserved by the system");
    } else if (sanitized) {
      const validation = validateAlias(sanitized);
      if (!validation.valid) {
        setAliasWarning(validation.error || "Invalid Alias");
      } else {
        setAliasWarning(null);
      }
    } else {
      setAliasWarning(null);
    }
  };

  const updateShortenedUrl = (newShortenedUrl: string | null) => {
    setShortenedUrl(newShortenedUrl);
    globalShortenedUrl = newShortenedUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedURL = url.trim();

    if (!url || !trimmedURL) {
      setError("Please enter a URL");
      toast.error("Please, enter a URL.");
      return;
    }

    if (!validator.isURL(trimmedURL, { require_protocol: true })) {
      setError("Please enter a valid URL");
      toast.error("Please enter a valid URL");
      return;
    }

    if (customAlias) {
      const sanitizedAlias = sanitizeAlias(customAlias);

      if (isReservedAlias(sanitizedAlias)) {
        setError("This alias is reserved by the system");
        toast.error("This alias is reserved by the system");
        return;
      }

      const validation = validateAlias(sanitizedAlias);
      if (!validation.valid) {
        setError(validation.error || "Invalid alias");
        toast.error(validation.error || "Invalid alias");
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const payload: { targetUrl: string; custom_id?: string } = {
        targetUrl: trimmedURL,
      };

      if (customAlias.trim()) {
        payload.custom_id = sanitizeAlias(customAlias.trim());
      }

      const response = await shortenUrl(payload);

      if (response?.short_url) {
        updateShortenedUrl(response.short_url);
        toast.success("URL Shortened Successfully.");

        if (onLinkCreated) {
          const newLink: LinkType = {
            id: response.id || Date.now().toString(),
            shortId: response.short_id || "",
            originalUrl: trimmedURL,
            shortUrl: response.short_url,
            clicks: 0,
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
          };
          onLinkCreated(newLink);
        }
      } else {
        throw new Error(response?.error || "Invalid response from server");
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        toast.error(e.message);
      } else {
        setError("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
      console.error("Error: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="size-5" />
          Shorten your link
        </CardTitle>
        <CardDescription>
          Paste your long URL and create a custom short link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original-url">Original URL</Label>
            <Input
              id="original-url"
              type="url"
              placeholder="https://example.com/my-long-url"
              value={url}
              onChange={(e) => updateUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-alias">Custom Alias (optional)</Label>
            <Input
              id="custom-alias"
              type="text"
              placeholder="mylink"
              value={customAlias}
              onChange={(e) => updateCustomAlias(e.target.value)}
              disabled={isLoading}
              className={aliasWarning ? "border-yellow-500" : ""}
            />
            {aliasWarning && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertCircle className="size-4" />
                {aliasWarning}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Only letters & numbers are allowed. Special characters will be
              removed.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Shortening...
              </>
            ) : (
              "Shorten Link"
            )}
          </Button>
        </form>

        {error && (
          <div
            className="mt-4 text-sm text-red-500"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {shortenedUrl && (
          <div className="bg-muted mt-4 rounded-lg p-4">
            <Label className="text-sm font-medium">Shortened Link:</Label>{" "}
            <div className="mt-2 flex items-center gap-2">
              <Input
                value={shortenedUrl}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(shortenedUrl)}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
