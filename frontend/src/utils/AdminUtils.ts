import { toast } from "sonner";

export const copyToClipboard = (text: string) => {
  if (!navigator.clipboard) {
    toast.error("API de clipboard não suportada no seu navegador");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Copiado para a área de transferência!");
    })
    .catch(() => {
      toast.error("Erro ao copiar para a área de transferência");
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
    ? "Ativo"
    : "Inativo";
};

export const truncateUrl = (url: string, maxLength: number = 35) => {
  return url.length > maxLength
    ? `${url.slice(0, maxLength)}...`
    : url;
};