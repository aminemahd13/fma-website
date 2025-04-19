"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/shared";
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
} from "@/components/shared/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shared/dropdown-menu"
import { removeUser } from "@/api/TeamApi";
import { toast } from "@/components/hooks/use-toast";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";

export function ActionButton({
  user
}:{
  user: any
}) {
  const userData = useRecoilValue<any>(userState);

  const onRemoveUser = async () => {
    try {
      const result = await removeUser(userData?.team?.id, user?.id);      
      window.location.reload()
    } catch(e) {
      toast({
        title: 'This operation have failed',
        description: 'There have a been a problem. Please try later',
        variant: 'destructive',
      });
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem>
            <AlertDialogTrigger>
              Supprimer de l&apos;équipe
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce membre de l&apos;équipe?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le membre concerné doit postuler à nouveau pour une nouvelle équipe afin que sa candidature soit prise en compte.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Fermer</AlertDialogCancel>
          <AlertDialogAction onClick={onRemoveUser} className="bg-red-500 hover:bg-red-800">Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}