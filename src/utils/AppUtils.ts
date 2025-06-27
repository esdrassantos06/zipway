import { toast } from "sonner";

export const copyToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    toast.error("Clipboard API not supported in your browser");
    return;
  }

  return navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Copied to clipboard!");
    })
    .catch(() => {
      toast.error("Error copying to clipboard");
    });
};

export const openLink = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export const getStatusDisplay = (
  status: string | undefined,
): "active" | "paused" => {
  return status?.toLowerCase() === "active" ? "active" : "paused";
};

export const getStatusLabel = (status: string | undefined) => {
  if (!status) return "Paused";
  return status.toLowerCase() === "active" ? "Active" : "Paused";
};

export const truncateUrl = (
  url: string | undefined,
  maxLength: number = 35,
) => {
  if (!url) return "";
  return url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;
};

export const getShortUrl = (shortId: string | undefined) => {
  return `${process.env.NEXT_PUBLIC_URL}/${shortId}`;
};

export const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
};
