import { toast } from "sonner";

export const copyToClipboard = (text: string) => {
  if (!navigator.clipboard) {
    toast.error("Clipboard API not supported in your browser");
    return;
  }

  navigator.clipboard
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

export const getStatusDisplay = (status: string) => {
  return status.toLowerCase() === "active" || status === "ACTIVE"
    ? "active"
    : "paused";
};

export const getStatusLabel = (status: string) => {
  return status.toLowerCase() === "active" || status === "ACTIVE"
    ? "Active"
    : "Paused";
};

export const truncateUrl = (url: string, maxLength: number = 35) => {
  return url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;
};

export const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
};
