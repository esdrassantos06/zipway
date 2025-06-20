"use client";
import { Trash } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import { deleteUserAction } from "@/actions/delete-user-action";
import { toast } from "sonner";
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

interface DeleteUserButtonProps {
  userId: string;
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    try {
      setIsPending(true);
      const { error } = await deleteUserAction({ userId });

      if (error) {
        toast.error(error);
      } else {
        toast.success("User deleted succesfuly!");
      }

      setIsPending(false);
    } catch (err) {
      console.error("Error: ", err);
      setIsPending(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={isPending}
        className={buttonVariants({ size: "sm", variant: "destructive" })}
      >
        <span className="sr-only">Delete user</span>
        <Trash size={12} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleClick}>
            <span className="sr-only">Delete user</span>
            <Trash size={12} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const PlaceholderButton = () => {
  return (
    <Button
      disabled
      size={"icon"}
      variant={"destructive"}
      className="cursor-not-allowed"
    >
      <span className="sr-only">Delete user</span>
      <Trash size={12} />
    </Button>
  );
};
