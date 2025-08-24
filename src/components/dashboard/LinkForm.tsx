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
      <CardHeader className="px-4 sm:px-6">
        <CardTitle
          data-testid="shorten-link-title"
          className="flex items-center gap-2 text-lg sm:text-xl"
        >
          <Link2Icon className="size-4 sm:size-5" />
          Shorten your link
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Paste your long URL and create a custom short link
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="original-url" className="text-sm sm:text-base">
              Original URL
            </Label>
            <Input
              id="original-url"
              data-testid="original-url-input"
              type="url"
              placeholder="https://example.com/my-long-url"
              {...register("targetUrl")}
              disabled={isLoading}
              className="text-sm sm:text-base"
            />
            {errors.targetUrl && (
              <div className="flex items-center gap-2 text-xs text-red-600 sm:text-sm">
                <AlertCircle className="size-3 sm:size-4" />
                {errors.targetUrl.message}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-alias" className="text-sm sm:text-base">
              Custom Alias (optional)
            </Label>
            <Input
              id="custom-alias"
              type="text"
              placeholder="mylink"
              {...register("customAlias")}
              className="text-sm sm:text-base"
            />
            {errors.customAlias && (
              <div className="flex items-center gap-2 text-xs text-yellow-600 sm:text-sm">
                <AlertCircle className="size-3 sm:size-4" />
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
            className="w-full text-sm sm:text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Shortening...
              </>
            ) : (
              <>
                <Link2Icon className="mr-2 size-4" />
                Shorten URL
              </>
            )}
          </Button>
        </form>

        {shortenedUrl && (
          <div className="mt-4 space-y-2 sm:mt-6">
            <Label className="text-sm font-medium sm:text-base">
              Your shortened URL:
            </Label>
            <div className="bg-muted flex items-center gap-2 rounded-md p-3">
              <Input
                value={shortenedUrl}
                readOnly
                data-testid="shortened-url-display"
                className="flex-1 border-0 bg-transparent font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-base"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                size="icon"
                variant="ghost"
                className="size-8 flex-shrink-0 sm:size-9"
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
