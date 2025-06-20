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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>;

type Props = {
  session: SessionType;
};

// Schema de validação
const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export const AccountInfo = ({ session }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDeleted, setImageDeleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: session?.user.name || "",
      email: session?.user.email || "",
      password: "",
    },
  });

  if (!session) return null;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
    setImageDeleted(false);
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

      window.location.reload();
    } catch {
      toast.error("Erro ao deletar imagem.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmailChanged(value !== session?.user.email);
  };

  const onSubmit = async (data: AccountFormValues) => {
    if (emailChanged && !data.password) {
      form.setError("password", {
        type: "required",
        message: "Digite sua senha para alterar o email.",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (data.name !== session?.user.name || imageFile) {
        const nameResult = await updateUserProfileAction({
          name: data.name !== session?.user.name ? data.name : undefined,
          imageFile: imageFile || undefined,
        });
        if (nameResult.error) {
          toast.error(nameResult.error);
          return;
        }
      }

      if (emailChanged && data.password) {
        const emailResult = await updateUserEmailAction({
          email: data.email,
          password: data.password,
        });
        if (emailResult.error) {
          toast.error(emailResult.error);
          return;
        }
      }

      toast.success("Perfil atualizado com sucesso!");

      form.setValue("password", "");
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="mx-auto mb-6 space-y-2 text-center">
              <Avatar className="mx-auto size-24">
                <AvatarImage src={currentImageSrc} alt="Profile" />
                <AvatarFallback className="text-2xl">
                  {getInitials(session?.user.name || "User")}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center gap-2">
                <Label className="inline-block cursor-pointer text-sm font-medium text-blue-600 hover:underline">
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

            {/* Form Fields */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={session?.user.name || "Digite seu nome"}
                        disabled={isLoading || isDeleting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={session?.user.email || "Digite seu email"}
                        disabled={isLoading || isDeleting}
                        onChange={(e) => {
                          field.onChange(e);
                          handleEmailChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {emailChanged && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Senha Atual (obrigatória para alterar email)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Digite sua senha atual"
                          disabled={isLoading || isDeleting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
        </Form>
      </CardContent>
    </Card>
  );
};
