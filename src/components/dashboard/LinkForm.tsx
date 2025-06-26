"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { linkFormSchema } from "@/validation/LinkFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Copy, Link2Icon, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/utils/AppUtils";
import z from "zod";

type LinkFormSchema = z.infer<typeof linkFormSchema>;

export function LinkForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LinkFormSchema>({
    resolver: zodResolver(linkFormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LinkFormSchema> = async (data) => {
    setIsLoading(true);
    setShortenedUrl(null);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUrl: data.targetUrl,
          custom_id: data.customAlias,
        }),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || "Error shortening URL.");
      }

      const resData = await response.json();
      setShortenedUrl(resData.short_url);
      toast.success("URL Shortened successfuly!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Internal Server Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle
          data-testid="shorten-link-title"
          className="flex items-center gap-2"
        >
          <Link2Icon className="size-5" />
          Shorten your link
        </CardTitle>
        <CardDescription>
          Paste your long URL and create a custom short link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original-url">Original URL</Label>
            <Input
              id="original-url"
              data-testid="original-url-input"
              type="url"
              placeholder="https://example.com/my-long-url"
              {...register("targetUrl")}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-alias">Custom Alias (optional)</Label>
            <Input
              id="custom-alias"
              type="text"
              placeholder="mylink"
              {...register("customAlias")}
            />
            {errors.customAlias && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertCircle className="size-4" />
                {errors.customAlias.message}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Only letters & numbers are allowed. Special characters will be
              removed.
            </p>
          </div>
          <Button
            data-testid="shorten-url-button"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
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
