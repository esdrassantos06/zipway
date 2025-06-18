"use client";

import type React from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { shortenUrl } from "@/utils/axios";
import validator from "validator";

let globalUrl = "";
let globalShortenedUrl: string | null = null;

export function ShortenUrlForm() {
  const [url, setUrl] = useState(globalUrl);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(
    globalShortenedUrl,
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
    <div className="flex w-full flex-col items-center space-y-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center justify-center space-y-4"
        data-testid="shorten-url-form"
      >
        <div className="w-full max-w-md space-y-2">
          <div className="flex gap-2">
            <Input
              value={url}
              type="text"
              name="url"
              className="w-full flex-1"
              onChange={(e) => updateUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className=""
              disabled={isLoading}
              data-testid="shorten-url-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Shortening...
                </>
              ) : (
                "Shorten"
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Free forever • No sign-up required
          </p>
        </div>

        {error && (
          <div
            id="url-error"
            className="mt-2 text-sm text-red-500"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
      </form>

      {shortenedUrl && (
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center rounded-md p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Your shortened URL:
            </p>
            <div className="flex w-full items-center gap-2">
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
        </div>
      )}
    </div>
  );
}
