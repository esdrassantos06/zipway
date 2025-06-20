"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Settings, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { auth } from "@/lib/auth";
import { getInitials } from "@/utils/AppUtils";
import {
  updateUserProfileAction,
  updateUserEmailAction,
  deleteUserProfileImageAction,
} from "@/actions/update-user-profile-action";
import { useState, useRef } from "react";
import { toast } from "sonner";

type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;

type Props = {
  session: SessionType;
};

export const AccountInfo = ({ session }: Props) => {
  const [name, setName] = useState(session?.user.name || "");
  const [email, setEmail] = useState(session?.user.email || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDeleted, setImageDeleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!session) return null;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB.");
      return;
    }

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
    setImageDeleted(false); // Reset delete state if new image is selected
    toast.success("Imagem selecionada! Clique em 'Save Changes' para salvar.");
  };

  const handleDeleteImage = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteUserProfileImageAction();
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Imagem deletada com sucesso!");
      setImageDeleted(true);
      setImageFile(null);
      setImagePreview(null);

      // Recarregar a página para mostrar as mudanças
      window.location.reload();
    } catch {
      toast.error("Erro ao deletar imagem.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailChanged(value !== session?.user.email);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailChanged && !password) {
      toast.error("Digite sua senha para alterar o email.");
      return;
    }

    setIsLoading(true);

    try {
      // Atualizar nome e/ou imagem
      if (name !== session?.user.name || imageFile) {
        const nameResult = await updateUserProfileAction({
          name: name !== session?.user.name ? name : undefined,
          imageFile: imageFile || undefined,
        });
        if (nameResult.error) {
          toast.error(nameResult.error);
          return;
        }
      }

      // Atualizar email se necessário
      if (emailChanged) {
        const emailResult = await updateUserEmailAction({ email, password });
        if (emailResult.error) {
          toast.error(emailResult.error);
          return;
        }
      }

      toast.success("Perfil atualizado com sucesso!");
      setPassword("");
      setEmailChanged(false);
      setImageFile(null);
      setImagePreview(null);

      window.location.reload();
    } catch {
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentImageSrc =
    imagePreview || (imageDeleted ? "" : session?.user.image || "");
  const hasImage = !imageDeleted && (imagePreview || session?.user.image);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="size-5 text-blue-600" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSaveChanges}>
          <div className="mx-auto mb-6 space-y-2 text-center">
            <Avatar className="mx-auto size-24">
              <AvatarImage src={currentImageSrc} alt="Profile" />
              <AvatarFallback className="text-2xl">
                {getInitials(session?.user.name || "User")}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center gap-2">
              <Label
                className="inline-block cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                {imageFile ? "Trocar imagem selecionada" : "Trocar imagem"}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isLoading || isDeleting}
                />
              </Label>

              {hasImage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteImage}
                  disabled={isLoading || isDeleting}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-1 size-4" />
                  {isDeleting ? "Deletando..." : "Deletar imagem"}
                </Button>
              )}
            </div>

            {imageFile && (
              <p className="text-xs text-green-600">
                Nova imagem selecionada: {imageFile.name}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={session?.user.name}
                disabled={isLoading || isDeleting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder={session?.user.email}
                disabled={isLoading || isDeleting}
              />
            </div>

            {emailChanged && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  Senha Atual (obrigatória para alterar email)
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  disabled={isLoading || isDeleting}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isDeleting}
              className="w-full"
            >
              {isLoading ? "Salvando..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
