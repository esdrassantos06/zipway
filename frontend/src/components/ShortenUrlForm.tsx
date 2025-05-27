"use client";

import type React from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { shortenUrl } from "@/utils/axios";
import validator from "validator";

let globalUrl = "";
let globalShortenedUrl: string | null = null;

export function ShortenUrlForm() {
  const [url, setUrl] = useState(globalUrl);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(
    globalShortenedUrl
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUrl = (newUrl: string) => {
    setUrl(newUrl);
    setShortenedUrl(null);
    globalUrl = newUrl;
    globalShortenedUrl = null;
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

    try {
      setIsLoading(true);
      setError(null);

      const response = await shortenUrl(trimmedURL);

      if (response.data?.short_url) {
        updateShortenedUrl(response.data.short_url);
        toast.success("URL Shortened Sucessfully.");
      } else {
        throw new Error("Invalid response from server");
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

  const copyClipboard = (url: string) => {
    if (!navigator.clipboard) {
      toast.error("Clipboard API is not supported in your browser");
      return;
    }

    try {
      navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy to clipboard");
      console.error("Failed to copy to clipboard", e);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        data-testid="shorten-url-form"
      >
        <div className="space-y-2">
          <Label htmlFor="url">Enter your URL</Label>
          <Input
            id="url"
            type="text"
            value={url}
            onChange={(e) => updateUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            disabled={isLoading}
          />
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 5000,
              removeDelay: 1000,

              success: {
                duration: 3000,
              },
            }}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          data-testid="shorten-url-button"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Shortening...
            </>
          ) : (
            "Shorten URL"
          )}
        </Button>

        {error && (
          <div
            id="url-error"
            className="text-sm text-red-500 mt-2"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
      </form>

      {shortenedUrl && (
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Your shortened URL:
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={shortenedUrl}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => copyClipboard(shortenedUrl)}
            >
              Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
