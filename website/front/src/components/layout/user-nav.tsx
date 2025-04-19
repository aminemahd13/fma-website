import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/avatar";
import { Button } from "@/components/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/shared/dropdown-menu";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { userState } from "@/store/userState";

export function UserNav(props: any) {
  const { firstName, lastName, email } = props;
  const router = useRouter();
  const setUserData = useSetRecoilState(userState);

  const handleLogOut = useCallback(() => {
    localStorage.removeItem('access_token');
    setUserData(undefined);

    router.push('/');
    window.location.reload();
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-solid border-2 border-sky-300">
            <AvatarFallback className="text-base">{firstName[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{firstName} {lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push('/profile/account')}
          >
            Profil
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogOut}
        >
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}