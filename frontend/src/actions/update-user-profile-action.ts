"use server";

import { prisma } from "@/lib/prisma";
import { getSessionFromHeaders } from "@/utils/getSession";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase";

const supabase = getSupabaseClient();

export async function updateUserProfileAction({
  name,
  imageFile,
}: {
  name?: string;
  imageFile?: File;
}) {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) throw new Error("Unauthorized");

  try {
    let imageUrl = undefined;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const arrayBuffer = await imageFile.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);

      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { image: true },
      });

      if (currentUser?.image) {
        const urlParts = currentUser.image.split("/");
        const currentImagePath = urlParts[urlParts.length - 1];
        if (currentImagePath && currentImagePath.includes(session.user.id)) {
          await supabase.storage.from("avatars").remove([currentImagePath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, fileBuffer, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(imageUrl && { image: imageUrl }),
      },
    });

    revalidatePath("/account");
    return { error: null };
  } catch (e) {
    console.error("Profile update error:", e);
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "Failed to update profile." };
  }
}

export async function updateUserEmailAction({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) throw new Error("Unauthorized");

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return { error: "Email já está em uso." };
    }

    const currentAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        password: { not: null },
      },
      select: { password: true },
    });

    if (!currentAccount || !currentAccount.password) {
      return { error: "Usuário não encontrado ou senha não definida." };
    }

    const { verifyPassword } = await import("@/lib/argon2");
    const isPasswordValid = await verifyPassword({
      password,
      hash: currentAccount.password,
    });

    if (!isPasswordValid) {
      return { error: "Senha incorreta." };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { email },
    });

    revalidatePath("/account");
    revalidatePath("/settings");
    return { error: null };
  } catch (e) {
    console.error("Email update error:", e);
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "Failed to update email." };
  }
}

export async function deleteUserProfileImageAction() {
  const headersList = await headers();
  const session = await getSessionFromHeaders(headersList);

  if (!session) throw new Error("Unauthorized");

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    if (!currentUser?.image) {
      return { error: "Nenhuma imagem encontrada para deletar." };
    }

    const urlParts = currentUser.image.split("/");
    const imagePath = urlParts[urlParts.length - 1];

    if (imagePath && imagePath.includes(session.user.id)) {
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([imagePath]);

      if (deleteError) {
        console.error("Error deleting image from storage:", deleteError);
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    revalidatePath("/account");
    return { error: null };
  } catch (e) {
    console.error("Delete profile image error:", e);
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "Erro ao deletar imagem do perfil." };
  }
}
