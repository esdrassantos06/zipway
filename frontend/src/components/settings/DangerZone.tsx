// src/components/DangerZone.tsx

"use client";

import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { toast } from "sonner";
import { deleteOwnAccountAction } from "@/actions/delete-own-account";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const DangerZone = () => {
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      await deleteOwnAccountAction();
      toast.success("Conta excluída com sucesso.");
    } catch {
      toast.error("Erro ao excluir conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Trash2 className="size-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Delete Account</h3>
          <p className="text-sm text-gray-500">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Excluir Conta</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={loading}
                className={cn(buttonVariants({ variant: "destructive" }))}
                onClick={handleDeleteAccount}
              >
                {loading ? "Excluindo..." : "Excluir Conta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
