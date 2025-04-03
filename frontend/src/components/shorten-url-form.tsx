"use client";

import type React from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function ShortenUrlForm() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !url.trim()) {
      setError("Please enter a URL");
      toast.error("Please, enter a URL.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await axios.post(apiUrl, { target_url: url });
      toast.success("URL Shortened Sucessfully.");

      if (response.data?.short_url) {
        setShortenedUrl(response.data.short_url);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (e) {
      const error = e as Error;
      setError(error.message || "An error occurred");
      toast.error(error.message);
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Enter your URL</Label>
          <Input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            disabled={isLoading}
            required
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Shortening...
            </>
          ) : (
            "Shorten URL"
          )}
        </Button>

        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
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
              onClick={() => {
                navigator.clipboard.writeText(shortenedUrl);
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
